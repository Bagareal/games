-- Posizione in classifica dell'utente loggato per un dato "gioco"
-- (che può essere una variante: 'boing:easy', 'wordio:en', ...).
--
-- Serve una funzione SECURITY DEFINER perché le policy RLS su game_progress
-- lasciano leggere a ciascuno solo le PROPRIE righe: contare quanti giocatori
-- hanno fatto meglio è impossibile dal client. Espone comunque solo un numero
-- (la posizione di chi chiama), mai i dati altrui.
--
-- L'ordinamento replica esattamente quello di get_leaderboard
-- (score desc, updated_at asc) così la posizione qui e il numero di riga lì
-- non possono discordare in caso di punteggi uguali.
create or replace function public.get_my_rank(p_game text)
returns table(rank integer, score integer)
language sql
security definer
set search_path = public
stable
as $$
  with me as (
    select gp.score, gp.updated_at from public.game_progress gp
    where gp.user_id = auth.uid() and gp.game = p_game and gp.score is not null
  )
  select (select count(*)::int + 1 from public.game_progress o, me
          where o.game = p_game and o.score is not null
            and (o.score > me.score
                 or (o.score = me.score and o.updated_at < me.updated_at))),
         me.score
  from me;
$$;

grant execute on function public.get_my_rank(text) to authenticated;
