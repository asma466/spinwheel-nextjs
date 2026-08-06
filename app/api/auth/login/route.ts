import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByEmail, verifyPassword, createSession } from '@/lib/auth';
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find employee by email
    const employee = await findEmployeeByEmail(email);
    if (!employee) {
       await logActivity({
    userId: null,
    userName: "Unknown User",
    userEmail: email,
    action: ActivityAction.LOGIN,
    module: ActivityModule.AUTH,
    description: `Failed login attempt. Email not found: ${email}`,
  });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, employee.password_hash);
    if (!passwordMatch) {
        await logActivity({
    userId: employee.id.toString(),
    userName: employee.name,
    userEmail: employee.email,
    action: ActivityAction.LOGIN,
    module: ActivityModule.AUTH,
    description: "Failed login attempt. Incorrect password.",
  });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = await createSession(employee.id);


    await logActivity({
  userId: employee.id.toString(),
  userName: employee.name,
  userEmail: employee.email,
  action: ActivityAction.LOGIN,
  module: ActivityModule.AUTH,
  description: "User logged in successfully.",
});
    // Create response with session cookie
    const response = NextResponse.json(
      {
        success: true,
        employee: {
          id: employee.id,
          email: employee.email,
          name: employee.name,
          department: employee.department,
        },
      },
      { status: 200 }
    );

    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    await logActivity({
  userId: null,
  userName: "System",
  userEmail: "system@wheelspin.com",
  action: ActivityAction.LOGIN,
  module: ActivityModule.AUTH,
  description: `Login API error: ${
    error instanceof Error ? error.message : String(error)
  }`,
});
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
