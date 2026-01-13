import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://mims_user:secure_password_123@localhost:5432/mims_geo_db';

// LOGIC: If the URL contains "localhost", disable SSL. Otherwise (Render), enable it.
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const client = new Client({ 
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

const createTableQuery = `
  CREATE EXTENSION IF NOT EXISTS postgis;

  CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    confidence INT DEFAULT 0,
    geom geography(Point, 4326) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
  );

  CREATE INDEX IF NOT EXISTS incidents_geom_idx ON incidents USING GIST (geom);
  
  INSERT INTO incidents (type, confidence, geom, expires_at)
  VALUES (
    'CHECKPOINT', 
    80, 
    ST_SetSRID(ST_MakePoint(-93.089958, 44.953705), 4326), 
    NOW() + INTERVAL '24 hours'
  );
`;

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to DB...');
    await client.query(createTableQuery);
    console.log('Migration & Seed success! Table "incidents" created.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();