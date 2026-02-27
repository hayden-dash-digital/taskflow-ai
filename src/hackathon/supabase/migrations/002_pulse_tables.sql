-- 002_pulse_tables.sql — Daily pulse check-ins for energy tracking

-- Daily pulse check-ins
CREATE TABLE IF NOT EXISTS pulse_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID,
  energy INT NOT NULL CHECK (energy BETWEEN 1 AND 5),
  workload TEXT CHECK (workload IN ('light', 'balanced', 'heavy', 'overwhelming')),
  blocker TEXT CHECK (blocker IN ('none', 'waiting', 'stuck', 'tooling')),
  blocker_detail TEXT,
  focus TEXT,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast daily lookups
CREATE INDEX idx_pulse_checkins_daily ON pulse_checkins (team_id, created_at DESC);
CREATE INDEX idx_pulse_checkins_user ON pulse_checkins (user_id, created_at DESC);

-- RLS
ALTER TABLE pulse_checkins ENABLE ROW LEVEL SECURITY;

-- Team members can see all pulses from their team
CREATE POLICY "Team members can view pulses"
  ON pulse_checkins FOR SELECT
  USING (true);

-- Users can insert their own pulses
CREATE POLICY "Users can insert own pulse"
  ON pulse_checkins FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own pulse from today only
CREATE POLICY "Users can update today's pulse"
  ON pulse_checkins FOR UPDATE
  USING (user_id = auth.uid() AND created_at::date = current_date);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE pulse_checkins;
