import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;

    // Build query with search
    const query = db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }).from(user);

    // Add search filter if provided
    if (search) {
      query = query.where(
        sql`lower(${user.name}) like ${`%${search.toLowerCase()}%`} OR lower(${user.email}) like ${`%${search.toLowerCase()}%`}`
      );
    }

    // Execute query with pagination
    const allUsers = await query
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db.select({ count: sql`count(*)` }).from(user);
    const totalUsers = Number(totalCountResult[0]?.count || 0);

    // Get comprehensive data for each user (includes Pro status)
    const usersWithProStatus = await Promise.all(
      allUsers.map(async (user) => {
        try {
          // This would normally use a more efficient query, but for now we'll use a simplified approach
          return {
            ...user,
            isProUser: false, // Placeholder - you'd implement actual Pro status check here
            proSource: null,
            proExpiresAt: null,
            lastSignIn: user.updatedAt,
          };
        } catch (error) {
          return {
            ...user,
            isProUser: false,
            proSource: null,
            proExpiresAt: null,
            lastSignIn: user.updatedAt,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithProStatus,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1,
      },
      search,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}