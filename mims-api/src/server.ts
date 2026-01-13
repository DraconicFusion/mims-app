import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Client } from 'pg';

const server = Fastify({ logger: true });

// Enable CORS so your frontend (port 5173) can fetch data from backend (port 3000)
await server.register(cors, {
  origin: true 
});

// Use the container hostname 'db' if inside Docker, or localhost if running locally
const connectionString = process.env.DATABASE_URL || 'postgres://mims_user:secure_password_123@localhost:5432/mims_geo_db';

const client = new Client({ connectionString });

await client.connect();

// The "Viewport" Endpoint
server.get('/api/v1/map/incidents', async (request, reply) => {
  // Query: Get all active incidents.
  const query = `
    SELECT 
      id, 
      type, 
      description,
      ST_AsGeoJSON(geom)::json as geometry 
    FROM incidents 
    WHERE expires_at > NOW()
  `;

  try {
    const res = await client.query(query);

    // Transform response to standard GeoJSON FeatureCollection
    const geojson = {
      type: "FeatureCollection",
      features: res.rows.map(row => ({
        type: "Feature",
        id: row.id,
        properties: {
          type: row.type,
          description: row.description
        },
        geometry: row.geometry
      }))
    };

    return geojson;
  } catch (err) {
    server.log.error(err);
    return reply.code(500).send({ error: 'Database query failed' });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
// Define what a Report looks like
interface ReportBody {
  type: string;
  description: string;
  lat: number;
  lng: number;
}

// The "Ingest" Endpoint
server.post('/api/v1/reports', async (request, reply) => {
  const { type, description, lat, lng } = request.body as ReportBody;

  // Basic validation
  if (!type || !lat || !lng) {
    return reply.code(400).send({ error: "Missing required fields (type, lat, lng)" });
  }

  // Insert into PostGIS
  // We use ST_MakePoint(lng, lat) - Note: PostGIS uses (Longitude, Latitude) order!
  const insertQuery = `
    INSERT INTO incidents (type, description, geom, expires_at)
    VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), NOW() + INTERVAL '4 hours')
    RETURNING id;
  `;

  try {
    await client.query(insertQuery, [type, description, lng, lat]);
    return reply.code(201).send({ success: true });
  } catch (err) {
    server.log.error(err);
    return reply.code(500).send({ error: "Failed to save report" });
  }
});
start();