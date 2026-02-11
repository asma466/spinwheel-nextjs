// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from 'bcryptjs';
// // import dbConnect from "@/libs/dbConnect";
// // import { UserModel } from "@/model/User";
// import { Console } from "console";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: " Credentials",

//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         console.log("Authorize called with credentials:", credentials);
//         await dbConnect();


//         try {
//           const user = await UserModel.findOne({ email: credentials.email });
//            console.log("User found:", user);
//           if (!user) {
//             throw new Error("User not found");
//           }
//            // Check if the user has a password (only for admin users)
//     // if (user.role === "admin") {
//     //   if (!user.password) {
//     //     throw new Error("Password is not set for this user");
//     //   }


//     //       // if (!user.isVerified) {
//     //       //   throw new Error("Please verify your email address before login");
//     //       // }

//     //       const ispasswordCorrect = await bcrypt.compare(
//     //         credentials.password,
//     //         user.password
//     //       );
//     //       if (ispasswordCorrect) {
//     //         return user;
//     //       } else {
//     //         throw new Error("Incorrect Password");
//     //       }

//     if (user.role === "admin") {
//        console.log("ADMIN LOGIN ATTEMPT")
//       if (!user.password) {
//         throw new Error("Password is not set for this user");
//       }

//       const isPasswordCorrect = await bcrypt.compare(
//         credentials.password,
//         user.password
//       );
//       console.log("Password match:", isPasswordCorrect);
//       if (!isPasswordCorrect) {
//         throw new Error("Incorrect Password");
//       }
//     } else {
//       // If the role is "user", skip password validation
//       if (credentials.password) {
//         throw new Error("Password is not required for this user");
//       }
//     }
//     return user;
//         } catch (err: any) {
//           throw new Error(err.message);
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.username = user.username;
//         token.role = user.role;
//         // token.isVerified = user.isVerified;
//         // token.isAcceptingMessage = user.isAcceptingMessage;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.username = token.username;
//           session.user.role = token.role as string; // ✅ ADD THIS 
//         // session.user.isVerified = token.isVerified;
//         // session.user.isAcceptingMessage = token.isAcceptingMessage;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
// secret: process.env.NEXTAUTH_SECRET,
// };
