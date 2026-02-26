-- 001_hackathon_tables.sql — 9 tables for hackathon war room

-- Hackathons
CREATE TABLE IF NOT EXISTS hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  created_by UUID REFERENCES auth.users(id),
  color TEXT DEFAULT '#5B4AE4',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Hackathon Participants
CREATE TABLE IF NOT EXISTS hackathon_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT now(),
  on_break BOOLEAN DEFAULT false,
  break_start TIMESTAMPTZ,
  UNIQUE (hackathon_id, user_id)
);

-- Ideas
CREATE TABLE IF NOT EXISTS hackathon_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  color TEXT DEFAULT '#EAB308',
  votes INTEGER DEFAULT 0,
  category TEXT DEFAULT 'Workshopping' CHECK (category IN ('Workshopping', 'Planning', 'In Review')),
  notes TEXT,
  archived BOOLEAN DEFAULT false,
  archive_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Idea Comments
CREATE TABLE IF NOT EXISTS hackathon_idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES hackathon_ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks
CREATE TABLE IF NOT EXISTS hackathon_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task Subtasks
CREATE TABLE IF NOT EXISTS hackathon_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES hackathon_tasks(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false
);

-- Goals
CREATE TABLE IF NOT EXISTS hackathon_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  weight INTEGER DEFAULT 20,
  color TEXT DEFAULT '#5B4AE4'
);

-- Goal → Task mapping
CREATE TABLE IF NOT EXISTS hackathon_goal_tasks (
  goal_id UUID REFERENCES hackathon_goals(id) ON DELETE CASCADE,
  task_id UUID REFERENCES hackathon_tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (goal_id, task_id)
);

-- Messages (chat)
CREATE TABLE IF NOT EXISTS hackathon_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security policies
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_goal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_messages ENABLE ROW LEVEL SECURITY;

-- Participants can read their hackathon data
CREATE POLICY "Participants can read hackathons" ON hackathons
  FOR SELECT USING (
    id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can read participants" ON hackathon_participants
  FOR SELECT USING (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can read ideas" ON hackathon_ideas
  FOR SELECT USING (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can insert ideas" ON hackathon_ideas
  FOR INSERT WITH CHECK (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can read messages" ON hackathon_messages
  FOR SELECT USING (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can insert messages" ON hackathon_messages
  FOR INSERT WITH CHECK (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Participants can read tasks" ON hackathon_tasks
  FOR SELECT USING (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can manage tasks" ON hackathon_tasks
  FOR ALL USING (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can read goals" ON hackathon_goals
  FOR SELECT USING (
    hackathon_id IN (SELECT hackathon_id FROM hackathon_participants WHERE user_id = auth.uid())
  );

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE hackathon_messages;
