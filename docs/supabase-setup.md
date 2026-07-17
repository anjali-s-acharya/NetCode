# Supabase Setup — step-by-step

Follow these steps once. At the end you'll have two values (project URL + anon key) — paste
them into the chat and the next pass will wire up auth, cross-device progress, streaks, and a
real leaderboard.

## 1. Create the project (~3 minutes)

1. Go to https://supabase.com and click **Start your project** → sign in with GitHub (or email).
2. Click **New project**.
3. Organization: accept the default personal org.
4. Name: `netcode` (anything works).
5. Database password: click **Generate a password** and save it somewhere (you won't need it
   day-to-day, but keep it).
6. Region: pick the one closest to you (e.g. `East US`).
7. Click **Create new project** and wait ~1 minute for provisioning.

## 2. Create the tables

1. In the left sidebar click **SQL Editor** → **New query**.
2. Paste ALL of the SQL below and click **Run**:

```sql
-- Profiles: one row per user, created automatically on signup
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  created_at timestamptz default now()
);

-- Progress: one row per solved challenge/lesson/stage
create table public.progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,          -- e.g. 'dns-timeout-001' or 'capstone-ospf-playbook-001:2'
  category text not null,         -- 'netcode' | 'codeops' | 'lesson' | 'capstone'
  points int not null default 0,
  solved_at timestamptz default now(),
  unique (user_id, item_id)
);

-- Row Level Security: users can only touch their own rows
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

create policy "own profile read"  on public.profiles for select using (auth.uid() = id);
create policy "own profile write" on public.profiles for update using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);

create policy "own progress read"   on public.progress for select using (auth.uid() = user_id);
create policy "own progress insert" on public.progress for insert with check (auth.uid() = user_id);

-- Leaderboard: a safe aggregated view anyone signed-in can read
create view public.leaderboard as
  select p.username, sum(g.points) as total_points, count(*) as solved
  from public.progress g
  join public.profiles p on p.id = g.user_id
  group by p.username
  order by total_points desc;

grant select on public.leaderboard to authenticated;

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

You should see "Success. No rows returned".

## 3. Enable email sign-in

1. Sidebar → **Authentication** → **Sign In / Up** (providers).
2. Make sure **Email** is enabled (it is by default). Magic-link login works out of the box —
   no SMTP setup needed for development (Supabase sends the emails for you, rate-limited).

## 4. Copy the two values

1. Sidebar → **Project Settings** (gear) → **API Keys**.
2. Copy **Project URL** (looks like `https://abcdefgh.supabase.co`).
3. Copy the **anon / public** key (a long `eyJ...` string). ⚠️ NOT the `service_role` key —
   that one must never go in frontend code.

## 5. Where they'll go (next pass does this)

Create `frontend/.env.local` (git-ignored) with:

```
VITE_SUPABASE_URL=https://YOURPROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Then paste the same two values into the chat and say "Supabase is ready" — the integration pass
will add: magic-link sign-in UI, syncing localStorage progress up on first login, server-side
progress writes on every solve, cross-device restore, and the leaderboard page reading the
`leaderboard` view.
