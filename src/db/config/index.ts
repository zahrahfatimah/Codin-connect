import { MongoClient } from "mongodb";
const connectionString =process.env.DATABASE_URI

if(!connectionString){
  throw new Error("Database Uri is not defined")

}
let client: MongoClient

export const getMongoClientInstance = async () => {
  if(!client){
    client = await MongoClient.connect(connectionString)
    await client.connect()

  }
  return client
}