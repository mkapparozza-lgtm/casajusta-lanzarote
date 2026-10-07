-- Abuso "otro" con texto libre breve. El texto NUNCA se publica: solo lo ve el admin.
-- Se guarda ya limpio (sin emails, teléfonos ni enlaces) y solo si se marca "otro".
alter table cases drop constraint if exists cases_abuses_check;
alter table cases add constraint cases_abuses_check check (abuses <@ array[
  'temporada','subida','honorarios','fianza',
  'devolucion','reparaciones','anuncio','entrada','otro']::text[]);

alter table cases add column if not exists other_text text;
alter table cases add constraint cases_other_text_check check (
  other_text is null or ('otro' = any(abuses) and length(other_text) between 3 and 200));
