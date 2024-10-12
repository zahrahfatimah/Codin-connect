"use server";

import { Db, ObjectId } from "mongodb";
import { getMongoClientInstance } from "../config";

const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = "Solutions";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  const db: Db = client.db(DATABASE_NAME);

  return db;
};

export interface NewSolutionInput {
  authorId: string;
  challengeId: string;
  solution: string;
  language: string;
}

export const createOrUpdateNewSolution = async (data: NewSolutionInput) => {
  try {
    const db = await getDb();

    const newChallenge = {
      authorId: new ObjectId(data.authorId),
      challengeId: new ObjectId(data.challengeId),
      solution: data.solution,
      language: data.language,
      createdAt: new Date(),
    };

    const existingSolution = await db.collection(COLLECTION_NAME).findOne({
      authorId: newChallenge.authorId,
      challengeId: newChallenge.challengeId,
    });

    if (existingSolution) {
      const updateResult = await db
        .collection(COLLECTION_NAME)
        .updateOne({ _id: existingSolution._id }, { $set: newChallenge });

      return updateResult;
    } else {
      const insertResult = await db
        .collection(COLLECTION_NAME)
        .insertOne(newChallenge);
      return insertResult;
    }
  } catch (error) {
    console.error("Error creating new challenge:", error);
    throw error;
  }
};
