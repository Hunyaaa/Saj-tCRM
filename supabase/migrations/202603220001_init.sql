create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  source text not null check (source in ('google','referral','workshop','direct','other')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  case_number text not null unique,
  title text not null,
  case_type text not null check (case_type in ('vehicle_damage','property_damage','ecs','other')),
  insurer text,
  claim_number text,
  vehicle_plate text,
  vin text,
  event_date date,
  status text not null default 'new' check (status in ('new','in_progress','waiting','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  title text not null,
  description text,
  due_date date not null,
  due_time time,
  status text not null default 'open' check (status in ('open','done')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  content text not null,
  note_type text not null default 'general' check (note_type in ('general','phone_call','email','insurer_update','client_update','internal')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text,
  category text not null check (category in ('invoice','insurer_letter','photo','estimate','contract','other')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_contacts_updated before update on public.contacts for each row execute function public.set_updated_at();
create trigger trg_cases_updated before update on public.cases for each row execute function public.set_updated_at();
create trigger trg_tasks_updated before update on public.tasks for each row execute function public.set_updated_at();
create trigger trg_notes_updated before update on public.notes for each row execute function public.set_updated_at();

create index if not exists idx_contacts_search on public.contacts using gin (to_tsvector('simple', coalesce(full_name,'') || ' ' || coalesce(phone,'') || ' ' || coalesce(email,'')));
create index if not exists idx_cases_contact on public.cases(contact_id);
create index if not exists idx_tasks_due on public.tasks(due_date, status);

alter table public.contacts enable row level security;
alter table public.cases enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.documents enable row level security;

create policy "auth full access contacts" on public.contacts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access cases" on public.cases for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access tasks" on public.tasks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access notes" on public.notes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access documents" on public.documents for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "auth upload documents" on storage.objects
for insert to authenticated
with check (bucket_id = 'documents');

create policy "auth read documents" on storage.objects
for select to authenticated
using (bucket_id = 'documents');
