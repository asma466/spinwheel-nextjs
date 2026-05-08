// // app/api/employees/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// import { NextResponse } from "next/server";


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

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("EMPLOYEE BODY:", body);

//     const { name, email, dob, department, role } = body;
//     const finalDob = dob;
    
//     if (![name, email, finalDob, department, role].every(Boolean)) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const parsedDob = new Date(finalDob);
//     if (isNaN(parsedDob.getTime())) {
//       return NextResponse.json(
//         { message: "Invalid DOB" },
//         { status: 400 }
//       );
//     }

//      // ✅ Validate enum properly (IMPORTANT)
//     if (!Object.values(role).includes(role as Role)) {
//       return NextResponse.json(
//         { message: "Invalid role value" },
//         { status: 400 }
//       );
//     }

//     const existingEmployee = await prisma.employee.findUnique({
//       where: { email: email.toLowerCase().trim() },
//     });

//     if (existingEmployee) {
//       return NextResponse.json(
//         { message: "Employee already exists" },
//         { status: 409 }
//       );
//     }

//     const employee = await prisma.employee.create({
//       data: {
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         department: department.trim(),
//             role, // ✅ enum-safe
//         // dob: parsedDob,
//         dob: body.dob ? new Date(body.dob) : undefined, // ✅ same fix
//         createdAt: new Date(),
//       },
//     });

//     return NextResponse.json(employee, { status: 201 });
//   } catch (error) {
//     console.error("CREATE EMPLOYEE ERROR:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { Prisma, PrismaClient } from "@prisma/client"; // ✅ import Role from Prisma
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// /* =======================================================
//    POST - Create Employee
// ======================================================= */
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, dob, department, role } = body;

//     /* -------------------- Validation -------------------- */
//     if (!name || !email || !dob || !department) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const parsedDob = new Date(dob);
//     if (isNaN(parsedDob.getTime())) {
//       return NextResponse.json(
//         { message: "Invalid DOB" },
//         { status: 400 }
//       );
//     }

//     /* -------------------- Auth Check -------------------- */
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const currentUser = session.user;

//     /* -------------------- Role Handling -------------------- */
//     let employeeRole: "USER" | "ADMIN" = "USER";

//     if (role === "ADMIN") {
//       if (currentUser.role !== "ADMIN") {
//         return NextResponse.json(
//           { message: "Only admins can create another admin" },
//           { status: 403 }
//         );
//       }
//       employeeRole = "ADMIN";
//     }

//     /* ---------------- Duplicate Email Check ---------------- */
//     const existingEmployee = await prisma.employee.findUnique({
//       where: { email: email.toLowerCase().trim() },
//     });

//     if (existingEmployee) {
//       return NextResponse.json(
//         { message: "Employee already exists" },
//         { status: 409 }
//       );
//     }

//     /* ------------------ Create Employee ------------------ */
//     const employee = await prisma.employee.create({
//       data: {
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         department: department.trim(),
//         dob: parsedDob,
//         role: employeeRole,
//        createdAt: new Date(), // 👈 makes TS happy
//       },
//     });

//     return NextResponse.json(
//       { message: "Employee created successfully", employee },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("CREATE EMPLOYEE ERROR:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     // Query params (optional)
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const search = searchParams.get("search") || "";

//     const skip = (page - 1) * limit;

//     /* ------------------ Query Employees ------------------ */
//     const [employees, total] = await Promise.all([
//       prisma.employee.findMany({
//         where: {
//           OR: [
//             { name: { contains: search } },
//             { email: { contains: search } },
//             { department: { contains: search } },
            
//           ],
//         },
//         orderBy: { createdAt: "desc" },
//         skip,
//         take: limit,
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           department: true,
//           dob: true,
//           role: true, 
//           createdAt: true,
//         },
//       }),

//       prisma.employee.count({
//         where: {
//           OR: [
//             { name: { contains: search } },
//             { email: { contains: search } },
//             { department: { contains: search } },
//           ],
//         },
//       }),
//     ]);

//     /* ------------------ Success Response ----------------- */
//     return NextResponse.json(
//       {
//         data: employees,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("GET EMPLOYEES ERROR:", error);
//     return NextResponse.json(
//       // { message: "Internal server error" },
//         { error: String(error) }, // 👈 show actual error
//       { status: 500 }
//     );
//   }
// }





import { PrismaClient } from "@prisma/client";

import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/getAdminSession";
// const prisma = new PrismaClient();
export const runtime = "nodejs";
/* =======================================================
   POST - Create Employee
======================================================= */
export async function POST(req: NextRequest) {
   // In App Router, getServerSession takes { req, res } from NextResponse
  // const session = await getServerSession(authOptions); // only req
  // if (!session?.user) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  try {
     const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { name, email, dob, department, role, password } = body;

    /* -------------------- Validation -------------------- */
    if (!name || !email || !dob || !department) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const parsedDob = new Date(dob);
    if (isNaN(parsedDob.getTime())) {
      return NextResponse.json(
        { message: "Invalid DOB" },
        { status: 400 }
      );
    }

    /* -------------------- Auth Check -------------------- */
    // const session = await getServerSession(authOptions);

    // if (!session?.user) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

// if (!session) {
//   return NextResponse.json(
//     { message: "Unauthorized" },
//     { status: 401 }
//   );
// }

    const currentUser = session.user;

    /* -------------------- Role Handling -------------------- */
    let employeeRole: "USER" | "ADMIN" = "USER";

    if (role === "ADMIN") {
      if (currentUser.role !== "ADMIN") {
        return NextResponse.json(
          { message: "Only admins can create another admin" },
          { status: 403 }
        );
      }

      if (!password) {
        return NextResponse.json(
          { message: "Password is required for admin" },
          { status: 400 }
        );
      }

      employeeRole = "ADMIN";
    }

    /* ---------------- Duplicate Email Check ---------------- */
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee already exists" },
        { status: 409 }
      );
    }

    /* ------------------ Hash Password ------------------ */
    let hashedPassword: string | null = null;

    if (employeeRole === "ADMIN") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    /* ------------------ Create Employee ------------------ */
    const employee =  await

    prisma.employee.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        department: department.trim(),
        dob: parsedDob,
        role: employeeRole,
        password: hashedPassword, // only ADMIN gets value
      },
    });

    return NextResponse.json(
      { message: "Employee created successfully", employee },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}

/* =======================================================
   GET - Fetch Employees
======================================================= */
export async function GET(req: NextRequest) {
  try {
      const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

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
          role: true,
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
       // 2️⃣ Sort birthdays today first
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const sortedEmployees = employees.sort((a, b) => {
      const isTodayA =
        new Date(a.dob).getDate() === todayDay &&
        new Date(a.dob).getMonth() + 1 === todayMonth;
      const isTodayB =
        new Date(b.dob).getDate() === todayDay &&
        new Date(b.dob).getMonth() + 1 === todayMonth;

      if (isTodayA && !isTodayB) return -1;
      if (!isTodayA && isTodayB) return 1;
      return 0;
    });

    return NextResponse.json(
      {
        data: sortedEmployees,
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
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}