// // app/api/employees/route.ts
// import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const { name, email, dob, department } = body;

//     /* -------------------- Validation -------------------- */
//     if (!name || !email || !dob || !department) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     if (typeof name !== "string" || typeof department !== "string") {
//       return NextResponse.json(
//         { message: "Invalid data type" },
//         { status: 400 }
//       );
//     }

//     const parsedDob = new Date(dob);
//     if (isNaN(parsedDob.getTime())) {
//       return NextResponse.json(
//         { message: "Invalid date format for DOB" },
//         { status: 400 }
//       );
//     }

//     /* ---------------- Duplicate Email Check -------------- */
//     const existingEmployee = await prisma.employee.findUnique({
//       where: { email },
//     });

//     if (existingEmployee) {
//       return NextResponse.json(
//         { message: "Employee with this email already exists" },
//         { status: 409 }
//       );
//     }

//     /* ------------------ Create Employee ------------------ */
//     const employee = await prisma.employee.create({
//       data: {
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         // dob: parsedDob,
//          dob: new Date(dob), // map here
//         department: department.trim(),
//       },
//     });

//     /* ------------------ Success Response ----------------- */
//     return NextResponse.json(
//       {
//         message: "Employee created successfully",
//         employee,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Create Employee Error:", error);

//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("EMPLOYEE BODY:", body);

    const { name, email, dob, department } = body;
    const finalDob = dob;

    if (![name, email, finalDob, department].every(Boolean)) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const parsedDob = new Date(finalDob);
    if (isNaN(parsedDob.getTime())) {
      return NextResponse.json(
        { message: "Invalid DOB" },
        { status: 400 }
      );
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee already exists" },
        { status: 409 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        department: department.trim(),
        // dob: parsedDob,
        dob: body.dob ? new Date(body.dob) : undefined, // ✅ same fix
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}




export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params (optional)
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    /* ------------------ Query Employees ------------------ */
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { department: { contains: search } },
          ],
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          dob: true,
          createdAt: true,
        },
      }),

      prisma.employee.count({
        where: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { department: { contains: search } },
          ],
        },
      }),
    ]);

    /* ------------------ Success Response ----------------- */
    return NextResponse.json(
      {
        data: employees,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error);
    return NextResponse.json(
      // { message: "Internal server error" },
        { error: String(error) }, // 👈 show actual error
      { status: 500 }
    );
  }
}



