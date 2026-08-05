// Free For Real — recupero account senza email.
// Riceve nickname + codice di recupero (mostrato una sola volta alla
// creazione dell'account) + nuova password. Se il codice combacia, imposta
// la nuova password e restituisce un NUOVO codice di recupero (quello
// vecchio smette di funzionare: uso singolo).
//
// Usa il service role key (disponibile automaticamente come variabile
// d'ambiente dentro le Edge Function) per poter reimpostare la password:
// questa è l'unica operazione del sistema che richiede privilegi elevati,
// per questo vive qui e non nel client.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// stessa normalizzazione usata lato client quando il codice viene generato:
// toglie spazi/trattini e mette tutto maiuscolo, così l'utente può
// incollarlo con o senza trattini.
function canonicalizeCode(code: string): string {
  return code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateRecoveryCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return hex.match(/.{1,4}/g)!.join("-"); // es. "A1B2-C3D4-E5F6-A7B8-C9D0"
}

function isValidPassword(pw: string): boolean {
  if (typeof pw !== "string" || pw.length < 8) return false;
  const digits = (pw.match(/[0-9]/g) || []).length;
  const specials = (pw.match(/[^A-Za-z0-9]/g) || []).length;
  return digits >= 2 && specials >= 2;
}

// chiave "secret" con privilegi di admin, necessaria per resettare la
// password. Nome variabile diverso a seconda della versione del progetto
// Supabase: quella nuova (SUPABASE_SECRET_KEYS) è un dizionario JSON di
// chiavi, quella vecchia (SUPABASE_SERVICE_ROLE_KEY, deprecata) è una
// stringa diretta.
function resolveSecretKey(): string {
  const rawDict = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (rawDict) {
    try {
      const parsed = JSON.parse(rawDict) as Record<string, unknown>;
      const values = Object.values(parsed).filter((v): v is string => typeof v === "string");
      if (values.length > 0) return values[0];
    } catch {
      // JSON malformato, proviamo il fallback qui sotto
    }
  }
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY");
  if (legacy) return legacy;
  throw new Error("no_secret_key_found");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: { nickname?: string; recovery_code?: string; new_password?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const nickname = (body.nickname || "").trim();
  const recoveryCode = (body.recovery_code || "").trim();
  const newPassword = body.new_password || "";

  if (!nickname || !recoveryCode) return json({ error: "missing_fields" }, 400);
  if (!isValidPassword(newPassword)) return json({ error: "weak_password" }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAdmin = createClient(supabaseUrl, resolveSecretKey());

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, recovery_code_hash")
    .eq("nickname_lower", nickname.toLowerCase())
    .maybeSingle();

  if (profileError) return json({ error: "lookup_failed" }, 500);
  if (!profile || !profile.recovery_code_hash) return json({ error: "invalid_code" }, 400);

  const submittedHash = await sha256Hex(canonicalizeCode(recoveryCode));
  if (submittedHash !== profile.recovery_code_hash) return json({ error: "invalid_code" }, 400);

  const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
    password: newPassword,
  });
  if (updateAuthError) return json({ error: "password_update_failed" }, 500);

  const newCode = generateRecoveryCode();
  const newHash = await sha256Hex(canonicalizeCode(newCode));
  const { error: updateProfileError } = await supabaseAdmin
    .from("profiles")
    .update({ recovery_code_hash: newHash })
    .eq("id", profile.id);
  if (updateProfileError) return json({ error: "recovery_code_rotate_failed" }, 500);

  return json({ success: true, new_recovery_code: newCode });
});
