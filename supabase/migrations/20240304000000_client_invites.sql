-- Phase 3: Client invites (trainer invites by email; link opens mobile app for signup)
create table if not exists public.client_invites (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers (id) on delete cascade,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create unique index if not exists idx_client_invites_trainer_email on public.client_invites (trainer_id, lower(email));
create index if not exists idx_client_invites_token on public.client_invites (token);
create index if not exists idx_client_invites_trainer_id on public.client_invites (trainer_id);

alter table public.client_invites enable row level security;

-- Trainers can manage their own invites
create policy "Trainers can manage their invites"
  on public.client_invites for all
  using (
    exists (
      select 1 from public.trainers t
      where t.user_id = auth.uid() and t.id = client_invites.trainer_id
    )
  );

-- Invite validation by token is done via API route (server-side) so we don't expose all invites to anon
