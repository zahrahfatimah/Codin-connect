import { Db, ObjectId } from "mongodb";
import { getMongoClientInstance } from "../config";

export type FollowModel = {
  _id: ObjectId;
  followingId: ObjectId;
  followerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = "Follows";

export const getDb = async () => {
  const client = await getMongoClientInstance();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const followUser = async (followerId: string, followingId: string) => {
  const db = await getDb();

  const followInput = {
    followerId: new ObjectId(followerId),
    followingId: new ObjectId(followingId),
  };

  const existingFollow = await db
    .collection(COLLECTION_NAME)
    .findOne(followInput);

  if (existingFollow) {
    await db.collection(COLLECTION_NAME).deleteOne(followInput);
    return "Unfollow success";
  } else {
    const followData: FollowModel = {
      _id: new ObjectId(),
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection(COLLECTION_NAME).insertOne(followData);
    return "Follow success";
  }
};

export const getFollowers = async (userId: string) => {
  const db = await getDb();
  const followers = await db
    .collection(COLLECTION_NAME)
    .find({ followingId: new ObjectId(userId) })
    .toArray();

  return followers.map((follow) => follow.followerId);
};

export const getFollowing = async (userId: string) => {
  const db = await getDb();
  const following = await db
    .collection(COLLECTION_NAME)
    .find({ followerId: new ObjectId(userId) })
    .toArray();

  return following.map((follow) => follow.followingId);
};


