// import { NextRequest, NextResponse } from 'next/server';
// import { deleteSession,  } from '@/lib/auth';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
// import { logActivity } from "@/lib/logger";
// import { ActivityAction, ActivityModule } from "@prisma/client";

// export async function POST(request: NextRequest) {
//   try {
//     const sessionId = request.cookies.get('session')?.value;

//     let userName = "Unknown User";
//     let userEmail = "unknown@wheelspin.com";
//     let userId: string | null = null;

//     // Get session data to log user info
//     const session = await getServerSession(authOptions);
//     if (session?.user) {
//       userId = session.user.id || null;
//       userName = session.user.name || "Unknown User";
//       userEmail = session.user.email || "unknown@wheelspin.com";
//     }

//     if (sessionId) {
//       await deleteSession(sessionId);
//     }

//     await logActivity({
//       userId: userId,
//       userName: userName,
//       userEmail: userEmail,
//       action: ActivityAction.LOGOUT,
//       module: ActivityModule.AUTH,
//       description: "User logged out successfully.",
//     });

//     const response = NextResponse.json(
//       { success: true, message: 'Logged out successfully' },
//       { status: 200 }
//     );

//     response.cookies.delete('session');

//     return response;
//   } catch (error) {
//     console.error('Logout error:', error);
    
//     await logActivity({
//       userId: null,
//       userName: "System",
//       userEmail: "system@wheelspin.com",
//       action: ActivityAction.LOGOUT,
//       module: ActivityModule.AUTH,
//       description: `Logout API error: ${
//         error instanceof Error ? error.message : String(error)
//       }`,
//     });
    
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { deleteSession } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

import {
  ActivityAction,
  ActivityModule,
} from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id ?? null;
    const userName = session?.user?.name ?? "Unknown User";
    const userEmail =
      session?.user?.email ?? "unknown@wheelspin.com";

    // Delete custom session (if it exists)
    const sessionId = request.cookies.get("session")?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Activity Log
    await logActivity({
      userId,
      userName,
      userEmail,
      action: ActivityAction.LOGOUT,
      module: ActivityModule.AUTH,
      description: `${userName} logged out successfully.`,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      {
        status: 200,
      }
    );

    // Remove custom session cookie
    response.cookies.delete("session");

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    await logActivity({
      userId: null,
      userName: "System",
      userEmail: "system@wheelspin.com",
      action: ActivityAction.LOGOUT,
      module: ActivityModule.AUTH,
      description: `Logout API failed. ${
        error instanceof Error ? error.message : String(error)
      }`,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}