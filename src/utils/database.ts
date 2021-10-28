import { MongoClient } from 'mongodb';

let client;

export async function connectDatabase(url: string) {
  client = new MongoClient(url);
  await client.connect();
}
