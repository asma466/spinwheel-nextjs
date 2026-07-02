import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import pool from '@/lib/db';

interface SessionUserRow extends RowDataPacket {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Query session from database
    const [rows] = await pool.execute(
      'SELECT sessions.*, users.id, users.email, users.full_name, users.role FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.token = ? AND sessions.expires_at > NOW()',
      [token]
    );

    const sessions = Array.isArray(rows) ? (rows as SessionUserRow[]) : [];

    if (sessions.length === 0) {
      return NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    const session = sessions[0];

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,
          full_name: session.full_name,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
