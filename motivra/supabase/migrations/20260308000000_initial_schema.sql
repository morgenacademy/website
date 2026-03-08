-- ============================================================
-- Motivra – Initial Schema
-- Migration: 20260308000000_initial_schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: organizations
-- ============================================================
create table organizations (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text unique not null,
  logo_url      text,
  website       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table organizations enable row level security;

-- ============================================================
-- TABLE: users
-- Extends Supabase auth.users via id foreign key
-- ============================================================
create table users (
  id                uuid primary key references auth.users(id) on delete cascade,
  organization_id   uuid references organizations(id) on delete set null,
  full_name         text,
  avatar_url        text,
  role              text not null default 'participant'
                      check (role in ('admin', 'coach', 'participant')),
  email             text unique not null,
  phone             text,
  date_of_birth     date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table users enable row level security;

-- ============================================================
-- TABLE: programs
-- ============================================================
create table programs (
  id               uuid primary key default uuid_generate_v4(),
  organization_id  uuid not null references organizations(id) on delete cascade,
  title            text not null,
  description      text,
  duration_weeks   int not null default 1 check (duration_weeks > 0),
  is_active        boolean not null default true,
  created_by       uuid references users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table programs enable row level security;

-- ============================================================
-- TABLE: enrollments
-- ============================================================
create table enrollments (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  program_id      uuid not null references programs(id) on delete cascade,
  status          text not null default 'active'
                    check (status in ('active', 'completed', 'dropped')),
  enrolled_at     timestamptz not null default now(),
  completed_at    timestamptz,
  unique (user_id, program_id)
);

alter table enrollments enable row level security;

-- ============================================================
-- TABLE: intake_responses
-- ============================================================
create table intake_responses (
  id             uuid primary key default uuid_generate_v4(),
  enrollment_id  uuid not null references enrollments(id) on delete cascade,
  question_key   text not null,
  question_label text,
  answer         text,
  created_at     timestamptz not null default now()
);

alter table intake_responses enable row level security;

-- ============================================================
-- TABLE: checkins
-- ============================================================
create table checkins (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  program_id    uuid references programs(id) on delete set null,
  mood          smallint check (mood between 1 and 10),
  energy_level  smallint check (energy_level between 1 and 10),
  sleep_hours   numeric(4,1),
  notes         text,
  checked_in_at timestamptz not null default now()
);

alter table checkins enable row level security;

-- ============================================================
-- TABLE: steps_log
-- ============================================================
create table steps_log (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  log_date   date not null,
  steps      int not null check (steps >= 0),
  source     text default 'manual',
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

alter table steps_log enable row level security;

-- ============================================================
-- TABLE: tracker_tokens
-- Stores OAuth tokens for wearable integrations (Fitbit, Garmin, etc.)
-- ============================================================
create table tracker_tokens (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  provider        text not null,
  access_token    text not null,
  refresh_token   text,
  token_type      text default 'Bearer',
  scope           text,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, provider)
);

alter table tracker_tokens enable row level security;

-- ============================================================
-- TABLE: movement_sessions
-- ============================================================
create table movement_sessions (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references users(id) on delete cascade,
  activity_type     text not null,
  duration_minutes  int check (duration_minutes > 0),
  distance_km       numeric(8,3),
  calories          int,
  heart_rate_avg    int,
  notes             text,
  source            text default 'manual',
  session_date      date not null,
  created_at        timestamptz not null default now()
);

alter table movement_sessions enable row level security;

-- ============================================================
-- TABLE: messages
-- Direct messages between two users
-- ============================================================
create table messages (
  id           uuid primary key default uuid_generate_v4(),
  sender_id    uuid not null references users(id) on delete cascade,
  recipient_id uuid not null references users(id) on delete cascade,
  content      text not null,
  is_read      boolean not null default false,
  sent_at      timestamptz not null default now(),
  read_at      timestamptz,
  check (sender_id <> recipient_id)
);

alter table messages enable row level security;

-- ============================================================
-- TABLE: group_messages
-- Messages within a program group
-- ============================================================
create table group_messages (
  id         uuid primary key default uuid_generate_v4(),
  program_id uuid not null references programs(id) on delete cascade,
  sender_id  uuid not null references users(id) on delete cascade,
  content    text not null,
  sent_at    timestamptz not null default now()
);

alter table group_messages enable row level security;

-- ============================================================
-- TABLE: videos
-- Educational / coaching video content linked to programs
-- ============================================================
create table videos (
  id               uuid primary key default uuid_generate_v4(),
  program_id       uuid references programs(id) on delete set null,
  organization_id  uuid references organizations(id) on delete cascade,
  title            text not null,
  description      text,
  video_url        text not null,
  thumbnail_url    text,
  duration_seconds int check (duration_seconds >= 0),
  order_index      int not null default 0,
  is_published     boolean not null default false,
  created_by       uuid references users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table videos enable row level security;

-- ============================================================
-- Indexes for common lookups
-- ============================================================
create index on enrollments (user_id);
create index on enrollments (program_id);
create index on intake_responses (enrollment_id);
create index on checkins (user_id, checked_in_at desc);
create index on steps_log (user_id, log_date desc);
create index on movement_sessions (user_id, session_date desc);
create index on messages (sender_id, recipient_id, sent_at desc);
create index on messages (recipient_id, is_read);
create index on group_messages (program_id, sent_at desc);
create index on videos (program_id, order_index);
