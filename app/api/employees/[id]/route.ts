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

    await prisma.employee.delete({
      where: {
        id: Number(id), // convert string → number
      },
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