import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { betterauthClient } from '@/lib/auth-client';

export async function POST(request: NextRequest) {
  try {
    const adminUser = await getComprehensiveUserData();
    
    // Check if user is admin (you can modify this condition)
    if (!adminUser || adminUser.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userEmail, action, reason } = body; // action: 'grant' or 'revoke'

    if (!userEmail || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, action' },
        { status: 400 }
      );
    }

    // Here you would implement the logic to grant/revoke premium access
    // For now, let's create a simple response
    
    const result = {
      success: true,
      action,
      userEmail,
      reason: reason || `${action === 'grant' ? 'Granted' : 'Revoked'} by admin`,
      timestamp: new Date().toISOString(),
      adminEmail: adminUser.email,
    };

    // Log the admin action
    console.log('Admin Premium Access Action:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin premium access error:', error);
    return NextResponse.json(
      { error: 'Failed to process admin action' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminUser = await getComprehensiveUserData();
    
    // Check admin access
    if (!adminUser || adminUser.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Return admin panel info
    return NextResponse.json({
      message: 'Admin Premium Access Panel',
      admin: {
        email: adminUser.email,
        name: adminUser.name,
      },
      actions: ['grant', 'revoke'],
      usage: {
        grant: 'POST with { userEmail, action: "grant", reason: "Student access" }',
        revoke: 'POST with { userEmail, action: "revoke", reason: "Expired" }',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load admin panel' },
      { status: 500 }
    );
  }
}