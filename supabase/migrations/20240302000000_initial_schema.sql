-- CoachFlow initial schema (Phase 1)
-- Run this in Supabase SQL Editor or via: supabase db push
-- Requires: Supabase project with Auth enabled

-- Extend auth.users with profile (role, name, email denormalized for RLS)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('trainer', 'client')),
  name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trainers (one row per trainer user)
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  business_name text,
  subscription_plan text,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Clients (linked to trainer)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  trainer_id uuid not null references public.trainers (id) on delete cascade,
  status text not null default 'active',
  start_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Workout templates (trainer-owned)
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (id) on delete cascade,
  title text not null,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Assignments (workout assigned to client for a week)
create table if not exists public.workout_assignments (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  week_start date not null,
  created_at timestamptz default now(),
  unique (workout_id, client_id, week_start)
);

-- Workout logs (client logs reps/weight)
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  exercise_name text not null,
  reps integer,
  weight numeric,
  completed_at timestamptz not null default now(),
  workout_id uuid references public.workouts (id) on delete set null,
  created_at timestamptz default now()
);

-- Create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.email
  )
  on conflict (id) do update set
    name = coalesce(excluded.name, profiles.name),
    email = coalesce(excluded.email, profiles.email),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: enable on all tables
alter table public.profiles enable row level security;
alter table public.trainers enable row level security;
alter table public.clients enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_assignments enable row level security;
alter table public.workout_logs enable row level security;

-- Profiles: users can read/update own
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Trainers: read/update own row (insert handled by app after signup)
create policy "Trainers can read own row"
  on public.trainers for select using (auth.uid() = user_id);
create policy "Trainers can insert own row"
  on public.trainers for insert with check (auth.uid() = user_id);
create policy "Trainers can update own row"
  on public.trainers for update using (auth.uid() = user_id);

-- Clients: trainers manage their clients; clients read own row
create policy "Trainers can manage their clients"
  on public.clients for all
  using (
    exists (
      select 1 from public.trainers t
      where t.user_id = auth.uid() and t.id = clients.trainer_id
    )
  );
create policy "Clients can read own row"
  on public.clients for select using (auth.uid() = user_id);

-- Workouts: trainers manage their own
create policy "Trainers can manage their workouts"
  on public.workouts for all
  using (
    exists (
      select 1 from public.trainers t
      where t.user_id = auth.uid() and t.id = workouts.trainer_id
    )
  );

-- Workout assignments: trainers manage; clients read own
create policy "Trainers can manage assignments"
  on public.workout_assignments for all
  using (
    exists (
      select 1 from public.clients c
      join public.trainers t on t.id = c.trainer_id
      where t.user_id = auth.uid() and c.id = workout_assignments.client_id
    )
  );
create policy "Clients can read own assignments"
  on public.workout_assignments for select
  using (
    exists (
      select 1 from public.clients c
      where c.user_id = auth.uid() and c.id = workout_assignments.client_id
    )
  );

-- Workout logs: clients insert/read own; trainers read their clients'
create policy "Clients can insert own logs"
  on public.workout_logs for insert with check (auth.uid() in (select user_id from public.clients where id = client_id));
create policy "Clients can read own logs"
  on public.workout_logs for select
  using (auth.uid() in (select user_id from public.clients where id = client_id));
create policy "Trainers can read their clients logs"
  on public.workout_logs for select
  using (
    exists (
      select 1 from public.clients c
      join public.trainers t on t.id = c.trainer_id
      where t.user_id = auth.uid() and c.id = workout_logs.client_id
    )
  );
