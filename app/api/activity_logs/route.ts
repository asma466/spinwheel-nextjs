import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ActivityAction, ActivityModule, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const search = searchParams.get("search") || "";
    const module = searchParams.get("module") || "";
    const action = searchParams.get("action") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.ActivityLogWhereInput = {
      AND: [
        search

          ? {
              OR: [
                {
                  userName: {
                    contains: search,
                  },
                },
                {
                  userEmail: {
                    contains: search,
                  },
                },
                {
                  description: {
                    contains: search,
                  },
                },
              ],
            }
          : {},

        module
          ? {
              module: module as  ActivityModule,
            }
          : {},

        action
          ? {
              action: action as ActivityAction,
            }
          : {},
      ],
    };

//     console.log("Prisma activityLog:", prisma.activityLog);
// console.log("Prisma keys:", Object.keys(prisma));
    
    const [logs, total] = await prisma.$transaction([
      prisma.activityLog.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.activityLog.count({
        where,
      }),
    ]);

    // return NextResponse.json({
    //   success: true,

    //   data: logs,

    //   pagination: {
    //     page,
    //     limit,
    //     total,
    //     totalPages: Math.ceil(total / limit),
    //   },
    // });

    return NextResponse.json({
  success: true,
  data: logs,
  meta: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch activity logs",
      },
      {
        status: 500,
      }
    );
  }
}