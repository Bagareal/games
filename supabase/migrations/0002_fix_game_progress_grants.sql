-- 0001_init.sql abilitava le policy RLS su game_progress ma dimenticava i
-- GRANT di base sulla tabella (le policy RLS filtrano QUALI righe, ma senza
-- un GRANT il ruolo non ha nemmeno il permesso di toccare la tabella): ogni
-- upsert/select falliva con "permission denied for table game_progress",
-- mascherato dal fallback locale (localStorage) di ogni gioco — sembrava
-- funzionare sullo stesso dispositivo, ma il salvataggio cloud non è mai
-- realmente avvenuto.
grant select, insert, update on public.game_progress to authenticated;
