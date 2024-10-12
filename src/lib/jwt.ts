import jwt from "jsonwebtoken";

import * as jose from "jose";

const SECRET_KEY = process.env.SECRET_KEY || "not safe key";

interface Payload {
  id: string;
  email: string;
}

export const createToken = (payload: object) => jwt.sign(payload, SECRET_KEY);
export const readPayload = (token: string): Payload => {
  return jwt.verify(token, SECRET_KEY) as Payload;
};

export const readPayloadJose = async <T>(token: string) => {
  const secretKey = new TextEncoder().encode(SECRET_KEY);
  const payloadJose = await jose.jwtVerify<T>(token, secretKey);

  return payloadJose.payload;
};
