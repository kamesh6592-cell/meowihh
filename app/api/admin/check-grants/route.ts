import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { db } from '@/lib/db';
import { adminGrant, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getComprehensiveUserData();
    
    // Check if user is admin
    if (!adminUser || adminUser.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all admin grants
    const grants = await db
      .select({
        id: adminGrant.id,
        userId: adminGrant.userId,
        grantedBy: adminGrant.grantedBy,
        grantedAt: adminGrant.grantedAt,
        expiresAt: adminGrant.expiresAt,
        reason: adminGrant.reason,
        status: adminGrant.status,
        revokedAt: adminGrant.revokedAt,
        revokedBy: adminGrant.revokedBy,
        revokeReason: adminGrant.revokeReason,
        userEmail: user.email,
        userName: user.name,
      })
      .from(adminGrant)
      .leftJoin(user, eq(adminGrant.userId, user.id))
      .orderBy(adminGrant.grantedAt);

    return NextResponse.json({
      total: grants.length,
      activeGrants: grants.filter(g => g.status === 'active').length,
      revokedGrants: grants.filter(g => g.status === 'revoked').length,
      grants,
    });
  } catch (error) {
    console.error('Check grants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grants', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
