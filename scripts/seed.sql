insert into public.contacts (full_name, phone, email, address, source, tags)
values
('Kovács Péter', '+36301112222', 'kovacs.peter@example.com', '1111 Budapest, Példa utca 1.', 'google', '{vip}'),
('Nagy Anna', '+36201234567', 'nagy.anna@example.com', '9021 Győr, Minta köz 5.', 'referral', '{uj}');

with c as (
  select id, full_name from public.contacts
)
insert into public.cases (contact_id, case_number, title, case_type, insurer, claim_number, status, priority, summary)
select id, concat('UGY-', row_number() over (), '/2026'), concat(full_name, ' kárügye'), 'vehicle_damage', 'Alfa Biztosító', concat('KAR-', row_number() over ()), 'in_progress', 'normal', 'Elsődleges adategyeztetés kész'
from c;
