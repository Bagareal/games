-- Converte i progressi salvati PRIMA delle classifiche separate per
-- lingua/difficoltà nelle rispettive voci di classifica.
--
-- Perché serve: le righe 'wordio:fr', 'boing:easy', ... le scrive solo il
-- codice nuovo, al primo salvataggio. Chi aveva già giocato e non è più
-- rientrato non compare in nessuna classifica, pur avendo il progresso
-- salvato nella riga storica ('wordio' / 'boing'). Caso reale: un giocatore
-- al livello 2 in francese, invisibile nella classifica francese.
--
-- `on conflict do nothing` protegge le righe già scritte dal codice nuovo,
-- che sono più aggiornate di quelle ricostruite qui.
-- Si usa jsonb_typeof(...) = 'object' invece dell'operatore `?` perché in
-- alcuni client il punto interrogativo viene scambiato per un segnaposto.

-- Wordio: una voce per ogni lingua giocata, col livello di quella lingua
insert into public.game_progress (user_id, game, data, score, updated_at)
select gp.user_id,
       'wordio:' || lang.key,
       '{}'::jsonb,
       (lang.value->>'level')::int,
       gp.updated_at
from public.game_progress gp
cross join lateral jsonb_each(gp.data->'progress') as lang(key, value)
where gp.game = 'wordio'
  and jsonb_typeof(gp.data->'progress') = 'object'
  and jsonb_typeof(lang.value->'level') = 'number'
on conflict (user_id, game) do nothing;

-- Boing, formato storico (una sola partita: {difficulty, level, ...})
insert into public.game_progress (user_id, game, data, score, updated_at)
select gp.user_id,
       'boing:' || (gp.data->>'difficulty'),
       '{}'::jsonb,
       (gp.data->>'level')::int,
       gp.updated_at
from public.game_progress gp
where gp.game = 'boing'
  and jsonb_typeof(gp.data->'difficulty') = 'string'
  and jsonb_typeof(gp.data->'level') = 'number'
on conflict (user_id, game) do nothing;

-- Boing, formato nuovo (una partita per difficoltà dentro byDifficulty)
insert into public.game_progress (user_id, game, data, score, updated_at)
select gp.user_id,
       'boing:' || d.key,
       '{}'::jsonb,
       coalesce((d.value->>'bestLevel')::int, (d.value->>'level')::int),
       gp.updated_at
from public.game_progress gp
cross join lateral jsonb_each(gp.data->'byDifficulty') as d(key, value)
where gp.game = 'boing'
  and jsonb_typeof(gp.data->'byDifficulty') = 'object'
  and coalesce((d.value->>'bestLevel')::int, (d.value->>'level')::int) is not null
on conflict (user_id, game) do nothing;
