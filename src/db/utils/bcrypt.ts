import bcryptjs from "bcryptjs";

export const hashPassword = (text: string): string => bcryptjs.hashSync(text);
export const comparePasswordWithHash = (text: string, hash: string): boolean =>
  bcryptjs.compareSync(text, hash);
