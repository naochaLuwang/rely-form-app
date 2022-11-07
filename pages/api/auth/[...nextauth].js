import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "../../../utils/db";
import bcrypt from "bcrypt";
import User from "../../../models/User";

dbConnect();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User Id", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        await dbConnect();
        const userId = credentials.userId;
        const password = credentials.password;

        const user = await User.findOne({
          userId,
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (user) {
          return signInUser({ password, user });
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: "secret",
  database: process.env.MONGODB_URI,
});

const signInUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Invalid password or email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};
