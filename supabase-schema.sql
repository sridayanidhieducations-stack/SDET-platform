-- ============================================================
-- SDET Platform - Supabase Database Schema
-- Sri Dayanidhi Educational Trust
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- USERS / PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text,
  phone text,
  role text not null default 'student', -- 'admin' | 'teacher' | 'student'
  subject text,                          -- for teachers: 'Physics', 'Math', etc.
  avatar_url text,
  approved boolean default false,        -- admin approves teachers; students auto-approved
  joined_date date default current_date,
  created_at timestamptz default now()
);

-- COURSES TABLE
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  description text,
  teacher_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ENROLLMENTS (Student ↔ Course)
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  unique(student_id, course_id)
);

-- WORKSHEETS TABLE
create table public.worksheets (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  teacher_id uuid references public.profiles(id),
  topic text not null,
  description text,
  questions jsonb not null default '[]',  -- array of question strings
  shared boolean default false,
  due_date date,
  created_at timestamptz default now()
);

-- SUBMISSIONS TABLE
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  worksheet_id uuid references public.worksheets(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  content text,
  file_url text,           -- if student uploads a file
  score numeric(4,1),      -- AI-assigned score
  feedback text,           -- AI-generated feedback
  weak_points jsonb default '[]',
  submitted_at timestamptz default now(),
  evaluated_at timestamptz,
  unique(worksheet_id, student_id)
);

-- WEAK POINTS TRACKER
create table public.student_weak_points (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  topic text not null,
  count integer default 1,        -- how many times flagged
  last_flagged timestamptz default now(),
  unique(student_id, course_id, topic)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.worksheets enable row level security;
alter table public.submissions enable row level security;
alter table public.student_weak_points enable row level security;

-- PROFILES: users can read all profiles, only update their own
create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select using (auth.role() = 'authenticated');

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- COURSES: everyone can view; only teachers/admins can create
create policy "Courses viewable by authenticated users"
  on public.courses for select using (auth.role() = 'authenticated');

create policy "Teachers can create courses"
  on public.courses for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher','admin'))
  );

create policy "Teachers can update their own courses"
  on public.courses for update using (teacher_id = auth.uid());

-- ENROLLMENTS
create policy "Students can view their own enrollments"
  on public.enrollments for select using (student_id = auth.uid());

create policy "Teachers can view enrollments in their courses"
  on public.enrollments for select using (
    exists (select 1 from public.courses where id = course_id and teacher_id = auth.uid())
  );

create policy "Students can self-enroll"
  on public.enrollments for insert with check (student_id = auth.uid());

-- WORKSHEETS: enrolled students can view shared ones; teachers manage their own
create policy "Enrolled students can view shared worksheets"
  on public.worksheets for select using (
    shared = true and
    exists (select 1 from public.enrollments where course_id = worksheets.course_id and student_id = auth.uid())
  );

create policy "Teachers can view all their worksheets"
  on public.worksheets for select using (teacher_id = auth.uid());

create policy "Teachers can manage their worksheets"
  on public.worksheets for all using (teacher_id = auth.uid());

-- SUBMISSIONS
create policy "Students can view and insert their own submissions"
  on public.submissions for select using (student_id = auth.uid());

create policy "Students can submit"
  on public.submissions for insert with check (student_id = auth.uid());

create policy "Teachers can view all submissions for their worksheets"
  on public.submissions for select using (
    exists (
      select 1 from public.worksheets w
      where w.id = worksheet_id and w.teacher_id = auth.uid()
    )
  );

create policy "Teachers can update submissions (for scoring)"
  on public.submissions for update using (
    exists (
      select 1 from public.worksheets w
      where w.id = worksheet_id and w.teacher_id = auth.uid()
    )
  );

-- WEAK POINTS
create policy "Students can view their own weak points"
  on public.student_weak_points for select using (student_id = auth.uid());

create policy "Teachers can view weak points of their students"
  on public.student_weak_points for select using (
    exists (select 1 from public.courses where id = course_id and teacher_id = auth.uid())
  );

create policy "System can upsert weak points"
  on public.student_weak_points for all using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGER: Auto-create profile on Google Sign-In
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role, approved)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'student',   -- everyone starts as student; admin promotes teachers
    true         -- students auto-approved; teachers need admin approval
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SEED: Create Admin (Arun Kumar MN) + initial courses
-- Run AFTER your first Google login so your user ID exists
-- Replace 'YOUR_USER_ID' with your actual UUID from auth.users
-- ============================================================

-- Step 1: After you log in with Google, run this in SQL Editor:
-- update public.profiles set role = 'admin', approved = true where email = 'your@gmail.com';

-- Step 2: Create initial courses
-- insert into public.courses (title, subject, description, teacher_id)
-- values
--   ('Physics - Class 11', 'Physics', 'Mechanics, Waves, Thermodynamics', 'YOUR_USER_ID'),
--   ('Mathematics - Class 11', 'Math', 'Calculus, Algebra, Statistics', 'YOUR_USER_ID');
