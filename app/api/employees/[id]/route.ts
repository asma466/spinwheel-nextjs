// import { NextResponse } from "next/server";

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   const body = await request.json();
//   return NextResponse.json({ id: params.id, ...body });
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   return NextResponse.json({ success: true });
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";

export const runtime = "nodejs";
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
 const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


// if (!session) {
//   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// }
    const { id } = await context.params; // ✅ unwrap params properly
   
    const body = await request.json();

    // Fetch old employee data to track changes
    const oldEmployee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    });

    if (!oldEmployee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: {
        id: Number(id), // convert URL param to number
      },
      data: {
        name: body.name,
        email: body.email,
        department: body.department,
        dob: body.dob ? new Date(body.dob) : undefined, // ✅ important
        role: body.role, 
         ...(body.password ? { password: await bcrypt.hash(body.password, 10) } : {}),
      },
    });

    // Track field changes
    const changes: Record<string, { before: any; after: any }> = {};

    if (oldEmployee.name !== body.name) {
      changes.name = { before: oldEmployee.name, after: body.name };
    }
    if (oldEmployee.email !== body.email) {
      changes.email = { before: oldEmployee.email, after: body.email };
    }
    if (oldEmployee.department !== body.department) {
      changes.department = { before: oldEmployee.department, after: body.department };
    }
    if (oldEmployee.role !== body.role) {
      changes.role = { before: oldEmployee.role, after: body.role };
    }
    if (body.dob && oldEmployee.dob?.toISOString() !== new Date(body.dob).toISOString()) {
      changes.dob = {
        before: oldEmployee.dob?.toISOString().split('T')[0],
        after: new Date(body.dob).toISOString().split('T')[0],
      };
    }
    if (body.password) {
      changes.password = { before: oldEmployee.password ? "***" : "", after: "***" };
    }

    console.log("UPDATE LOG - Changes tracked:", changes);

    const changedFields = Object.keys(changes);
    const labels = changedFields.map((field) => {
      switch (field) {
        case "name":
          return "name";
        case "email":
          return "email";
        case "department":
          return "department";
        case "role":
          return "role";
        case "dob":
          return "birthday";
        case "password":
          return "password";
        default:
          return field;
      }
    });

    const changeLabel = labels.length === 0
      ? "no fields changed"
      : labels.length === 1
      ? `${labels[0]} changed`
      : labels.length === 2
      ? `${labels[0]} and ${labels[1]} changed`
      : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]} changed`;

    const logData = {
      userId: session.user.id?.toString(),
      userName: session.user.name ?? "Unknown User",
      userEmail: session.user.email ?? "Unknown Email",
      action: ActivityAction.UPDATE,
      module: ActivityModule.EMPLOYEES,
      description: `Updated employee ${updatedEmployee.name}: ${changeLabel}`,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    };

    console.log("UPDATE LOG - Data being sent to logActivity:", JSON.stringify(logData, null, 2));

    await logActivity(logData);
   

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}



//Delete api route
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    const { id } = await context.params; 

    // Find employee first to get name and email for logs
    const employeeToDelete = await prisma.employee.findUnique({
      where: { id: Number(id) }
    });
     if (!employeeToDelete) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    await prisma.employee.delete({
      where: {
        id: Number(id), // convert string → number
      },
    });

    // await logActivity({
    //   actorId: Number(session.user.id),
    //   actorName: session.user.name || session.user.email,
    //   action: "DELETE_EMPLOYEE",
    //   details: `Deleted employee ID ${id}: ${employeeToDelete?.name || "Unknown"} (${employeeToDelete?.email || "Unknown"})`,
    // });


        // Activity Log
    await logActivity({
      userId: session.user.id?.toString(),
      userName: session.user.name ?? "Unknown User",
      userEmail: session.user.email ?? "Unknown Email",

      action: ActivityAction.DELETE,
      module: ActivityModule.EMPLOYEES,

      description: `Deleted employee ${employeeToDelete?.name}`,
    });

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}