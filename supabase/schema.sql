-- ================= Mother Journey schema =================
create extension if not exists pgcrypto;

create table if not exists pregnancies (
  id uuid primary key default gen_random_uuid(),
  mother_name text not null default 'Mama',
  lmp date not null,
  edd date generated always as (lmp + 280) stored,
  created_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id) on delete cascade,
  kind text check (kind in ('scan','blood','rx','note','vax')),
  title text,
  doc_date date,
  extracted jsonb,
  created_at timestamptz default now()
);

create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id) on delete cascade,
  log_date date not null default current_date,
  weight_kg numeric(5,2),
  kicks int,
  mood int check (mood between 1 and 5),
  symptoms text,
  unique (pregnancy_id, log_date)
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  pregnancy_id uuid references pregnancies(id) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz default now()
);

-- MVP policies: open anon access (tighten with Supabase Auth before public launch)
alter table pregnancies enable row level security;
alter table documents enable row level security;
alter table daily_logs enable row level security;
alter table push_subscriptions enable row level security;

create policy "anon full pregnancies" on pregnancies for all using (true) with check (true);
create policy "anon full documents" on documents for all using (true) with check (true);
create policy "anon full daily_logs" on daily_logs for all using (true) with check (true);
create policy "anon full push" on push_subscriptions for all using (true) with check (true);
