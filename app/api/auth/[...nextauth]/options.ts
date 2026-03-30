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



// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma"; // your Prisma client

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any) {
//         if (!credentials?.email) {
//           throw new Error("Email is required");
//         }

//         // Find user in database
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email.toLowerCase().trim() },
//         });

//         if (!user) {
//           throw new Error("User not found");
//         }

//         // Admin login must have password
//         if (user.role === "ADMIN") {
//           if (!credentials.password) {
//             throw new Error("Password is required for admin login");
//           }

//           if (!user.password) {
//             throw new Error("Admin password is not set");
//           }

//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );

//           if (!isPasswordCorrect) {
//             throw new Error("Incorrect password");
//           }
//         } else {
//           // USER role can skip password if you want
//           if (credentials.password) {
//             throw new Error("Password is not required for regular users");
//           }
//         }

//         // return user;

//         // ✅ Convert id to string to satisfy NextAuth types
//   return {
//     id: user.id.toString(),
//     email: user.email,
//     role: user.role,
//   };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id.toString();
//         token.email = user.email;
//         token.role = user.role;
//       }
//       return token;
//     },

//     // async session({ session, token }) {
//     //   if (token) {
//     //     session.user.id = token.id;
//     //     session.user.email = token.email;
//     //     session.user.role = token.role as string;
//     //   }
//     //   return session;
//     // },
//      async session({ session, token }) {
//     if (session.user) {
//       session.user.role = token.role;
//     }
//     return session;
//   },
//   },

//   pages: {
//     signIn: "/sign-in",
//   },

//   session: {
//     strategy: "jwt",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };


// src/pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) throw new Error("Email is required");

        const user = await prisma.employee.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) throw new Error("User not found");

        // Make sure role is always a string
     const role = (user.role ?? "USER").toUpperCase();
        const name = user.name ?? "";

        // Admin login must have password
        if (role === "ADMIN") {
          if (!credentials?.password) throw new Error("Password required for admin");
          if (!user.password) throw new Error("Admin password not set");
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect password");
        }

        // User login can skip password (optional)
        if (role === "USER" && credentials?.password) {
          throw new Error("Password not required for regular users");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role,
          name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);