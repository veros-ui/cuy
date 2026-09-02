CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  google_id TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  function_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO projects (name, slug, description, function_text, image_url, tags) VALUES
('Nebula Chat','nebula-chat','Realtime team messaging with presence, typing indicators and read receipts.','Realtime collaboration','https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',ARRAY['Realtime','Collaboration']),
('Atlas API','atlas-api','A production-ready REST API foundation with clean routing and validation.','Backend services','https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',ARRAY['API','Backend']),
('Pulse Dashboard','pulse-dashboard','A focused analytics dashboard for monitoring product and operational metrics.','Analytics','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',ARRAY['Analytics','Dashboard']),
('Forge Tools','forge-tools','A collection of small developer utilities for automation and workflow acceleration.','Developer productivity','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',ARRAY['Tools','Automation'])
ON CONFLICT (slug) DO NOTHING;