import { NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';

export async function GET() {
  try {
    const userData = await getComprehensiveUserData();
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return subscription status information
    const subscriptionInfo = {
      isProUser: userData.isProUser,
      proSource: userData.proSource,
      subscriptionStatus: userData.subscriptionStatus,
      polarSubscription: userData.polarSubscription ? {
        status: userData.polarSubscription.status,
        currentPeriodEnd: userData.polarSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: userData.polarSubscription.cancelAtPeriodEnd,
        amount: userData.polarSubscription.amount,
        currency: userData.polarSubscription.currency,
      } : null,
      dodoPayments: userData.dodoPayments ? {
        hasPayments: userData.dodoPayments.hasPayments,
        expiresAt: userData.dodoPayments.expiresAt,
        isExpired: userData.dodoPayments.isExpired,
        isExpiringSoon: userData.dodoPayments.isExpiringSoon,
        daysUntilExpiration: userData.dodoPayments.daysUntilExpiration,
      } : null,
    };

    return NextResponse.json(subscriptionInfo);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}