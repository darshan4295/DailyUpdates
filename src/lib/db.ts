import { Pool } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_5UucDTobK2Xy@ep-patient-paper-a880gsg2-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  // monkey patch the query method to keep track of the last query executed
  client.query = (...args: any[]) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  // set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);
  client.release = () => {
    // clear our timeout
    clearTimeout(timeout);
    // set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  return client;
};
