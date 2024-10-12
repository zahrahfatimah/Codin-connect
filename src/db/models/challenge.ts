"use server";

import { ObjectId } from "mongodb";
import { getMongoClientInstance } from "../config";
import { getProfileById } from "./user";

export type TestCaseModel = {
  input: string;
  expectedOutput: string;
};

export type ChallengeModel = {
  _id: ObjectId;
  title: string;
  description: string;
  functionName: string;
  parameters: string;
  testCases: TestCaseModel[];
  author: string;
};

const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = "Challenges";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  return client.db(DATABASE_NAME);
};

export const getChallengeById = async (
  id: string
): Promise<ChallengeModel | null> => {
  const db = await getDb();
  const objectId = new ObjectId(id);

  const challenge = await db
    .collection(COLLECTION_NAME)
    .aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();

  return challenge.length > 0
    ? {
        _id: challenge[0]._id,
        title: challenge[0].title,
        description: challenge[0].description,
        functionName: challenge[0].functionName,
        parameters: challenge[0].parameters,
        testCases: challenge[0].testCases,
        author: challenge[0].author.name,
      }
    : null;
};

export interface NewChallengeInput {
  authorId: string;
  title: string;
  description: string;
  functionName: string;
  parameters: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

export const getChallenges = async () => {
  const db = await getDb();
  const challenges = await db
    .collection("Challenges")
    .aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .toArray();

  return challenges;
};

export const createNewChallenge = async (data: NewChallengeInput) => {
  try {
    const db = await getDb();

    const newChallenge = {
      authorId: new ObjectId(data.authorId),
      title: data.title,
      description: data.description,
      functionName: data.functionName,
      parameters: data.parameters,
      testCases: data.testCases,
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newChallenge);

    return result;
  } catch (error) {
    console.error("Error creating new challenge:", error);
    throw error;
  }
};

export const getChallengesByFollowing = async (arrayOfIds: string[]) => {
  try {
    const db = await getDb();

    const arrayOfObjectIds = arrayOfIds.map((id) => new ObjectId(id));

    const challenges = await db
      .collection(COLLECTION_NAME)
      .aggregate([
        {
          $match: { authorId: { $in: arrayOfObjectIds } },
        },
        {
          $lookup: {
            from: "Users",
            localField: "authorId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $unwind: {
            path: "$User",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
      .toArray();

    return challenges.map((challenge) => ({
      _id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      functionName: challenge.functionName,
      parameters: challenge.parameters,
      testCases: challenge.testCases,
      author: challenge.User ? challenge.User.name : "Unknown",
      authorUsername: challenge.User ? challenge.User.username : "Unknown",
    }));
  } catch (err) {
    console.error("Error fetching challenges:", err);
    return [];
  }
};

interface Challenge {
  _id: string;
}

interface Solution {
  challenge: Challenge;
}

export const getNextChallengeId = async (_id: string) => {
  const db = await getDb();

  const fullProfile = await getProfileById(_id);

  const userSolutions: Solution[] | undefined = fullProfile?.userSolutions;

  const userChallengeSolutionsId = userSolutions?.map(
    (userSolution: Solution) => {
      return userSolution.challenge._id;
    }
  );

  const randomChallengeCursor = await db
    .collection("Challenges")
    .aggregate([
      { $match: { _id: { $nin: userChallengeSolutionsId } } },
      { $sample: { size: 1 } },
    ]);

  const randomChallenge = await randomChallengeCursor.next();

  return randomChallenge?._id;
};
