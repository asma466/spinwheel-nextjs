// // import { prisma } from "@/lib/prisma";

// // export interface LogParams {
// //   actorId?: number | null;
// //   actorName?: string | null;
// //   action: string;
// //   details: string;
// // }

// // export async function logActivity({ actorId, actorName, action, details }: LogParams) {
// //   try {
// //     await prisma.activitylog.create({
// //       data: {
// //         actorId: actorId ?? null,
// //         actorName: actorName ?? "System",
// //         action,
// //         details,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Failed to write activity log:", error);
// //   }
// // }



// // import {prisma }from "@/lib/prisma";

// // type LogData = {
// //   userId?: string;
// //   userName: string;
// //   userEmail: string;
// //   action: string;
// //   module: string;
// //   description: string;
// // };

// // export async function logActivity(data: LogData) {
// //   await prisma.activityLog.create({
// //     data,
// //   });
// // }

// // await logActivity({
// //     action: "CREATE",
// //     module: "EMPLOYEES",
// //     description: `Created employee ${employee.name}`,
// //     session,
// // });



// // import { prisma } from "@/lib/prisma";
// // import { auth } from "@/auth";

// // export type LogActivityData = {
// //   action: string;
// //   module: string;
// //   description: string;
// // };

// // export async function logActivity({
// //   action,
// //   module,
// //   description,
// // }: LogActivityData) {
// //   try {
// //     const session = await auth();

// //     await prisma.activityLog.create({
// //       data: {
// //         userId: session?.user?.id
// //           ? String(session.user.id)
// //           : null,

// //         userName: session?.user?.name ?? "System",

// //         userEmail: session?.user?.email ?? "system@wheelspin.com",

// //         action,

// //         module,

// //         description,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Activity Log Error:", error);
// //   }
// // }


// import { prisma } from "@/lib/prisma";
// import { ActivityAction, ActivityModule } from "@prisma/client";

// export interface LogActivityParams {
//   userId?: string | null;
//   userName: string;
//   userEmail: string;

//   action: ActivityAction;
//   module: ActivityModule;

//   description: string;
// }

// export async function logActivity({
//   userId,
//   userName,
//   userEmail,
//   action,
//   module,
//   description,
// }: LogActivityParams) {
//   try {
//     await prisma.activityLog.create({
//       data: {
//         userId,
//         userName,
//         userEmail,
//         action,
//         module,
//         description,
//       },
//     });
//   } catch (error) {
//     console.error("Activity Log Error:", error);
//   }
// }


import { prisma } from "@/lib/prisma";
import { ActivityAction, ActivityModule, Prisma } from "@prisma/client";

export interface FieldChange {
  before: Prisma.JsonValue;
  after: Prisma.JsonValue;
}

export interface LogActivityParams {
  userId?: string | null;
  userName: string;
  userEmail: string;
  action: ActivityAction;
  module: ActivityModule;
  description: string;
  changes?: Record<string, FieldChange>; // Track field changes {fieldName: {before: value, after: value}}
}

export async function logActivity({
  userId,
  userName,
  userEmail,
  action,
  module,
  description,
  changes,
}: LogActivityParams) {
  try {
    console.log("logActivity - Received changes:", changes);
    
    const logRecord = await prisma.activityLog.create({
      data: {
        userId,
        userName,
        userEmail,
        action,
        module,
        description,
        changes: changes
  ? (changes as unknown as Prisma.InputJsonObject)
  : Prisma.JsonNull,
      //    changes: changes
      // ? (changes as Prisma.InputJsonValue)
      // : Prisma.JsonNull,
      },
    });

    console.log("logActivity - Successfully saved with changes:", logRecord.changes);
  } catch (error) {
    console.error("Activity Log Error:", error);
  }
}