-- Free For Real — schema iniziale: profili, progressi di gioco, leaderboard.
-- Filosofia: solo nickname + password (nessuna email/dato personale), solo il
-- progresso di gioco viene salvato. Vedi supabase/README.md per i dettagli.

-- ================= PROFILES =================
-- Un profilo per utente registrato. Il nickname è l'unico identificativo
-- (login = nickname trasformato in "email finta" nickname@ffr-games.local
-- lato client, mai mostrata all'utente).
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  nickname_lower text generated always as (lower(nickname)) stored,
  recovery_code_hash text,
  created_at timestamptz not null default now(),
  constraint nickname_format check (nickname ~ '^[A-Za-z0-9_]{3,20}$')
);

create unique index profiles_nickname_lower_key on public.profiles (nickname_lower);

alter table public.profiles enable row level security;

-- il nickname è pubblico (serve per la leaderboard), il resto no
create policy "nickname pubblico in lettura"
  on public.profiles for select
  using (true);

create policy "utente aggiorna solo il proprio profilo"
  on public.profiles for update
  using (auth.uid() = id);

revoke select on public.profiles from anon, authenticated;
grant select (id, nickname, nickname_lower, created_at) on public.profiles to anon, authenticated;
grant update (recovery_code_hash) on public.profiles to authenticated;

-- crea automaticamente il profilo quando qualcuno si registra
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, new.raw_user_meta_data->>'nickname');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ================= GAME PROGRESS =================
-- Un solo record per (utente, gioco): i dati completi di progresso in jsonb
-- (stessa struttura già usata in localStorage da ogni gioco), più un campo
-- "score" numerico separato che ogni gioco definisce a modo suo, usato solo
-- per ordinare la leaderboard.
create table public.game_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  game text not null,
  data jsonb not null default '{}'::jsonb,
  score integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, game)
);

alter table public.game_progress enable row level security;

create policy "utente vede solo i propri progressi"
  on public.game_progress for select
  using (auth.uid() = user_id);

create policy "utente inserisce solo i propri progressi"
  on public.game_progress for insert
  with check (auth.uid() = user_id);

create policy "utente aggiorna solo i propri progressi"
  on public.game_progress for update
  using (auth.uid() = user_id);

-- ================= LEADERBOARD =================
-- Unico canale pubblico che espone punteggi: nickname + score, niente altro.
create function public.get_leaderboard(p_game text, p_limit int default 20)
returns table(nickname text, score integer, updated_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select p.nickname, gp.score, gp.updated_at
  from public.game_progress gp
  join public.profiles p on p.id = gp.user_id
  where gp.game = p_game and gp.score is not null
  order by gp.score desc, gp.updated_at asc
  limit least(p_limit, 100);
$$;

grant execute on function public.get_leaderboard(text, int) to anon, authenticated;
