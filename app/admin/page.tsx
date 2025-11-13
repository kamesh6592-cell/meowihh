'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, UserPlus, UserX, TestTube, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  const handlePremiumAction = async (action: 'grant' | 'revoke') => {
    if (!userEmail.trim()) {
      toast.error('Please enter user email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/premium-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail.trim(),
          action,
          reason: reason.trim() || `${action === 'grant' ? 'Manual grant' : 'Manual revoke'} by admin`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully ${action === 'grant' ? 'granted' : 'revoked'} premium access for ${userEmail}`);
        setUserEmail('');
        setReason('');
      } else {
        toast.error(data.error || 'Action failed');
      }
    } catch (error) {
      toast.error('Failed to perform action');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPayment = async () => {
    setTestLoading(true);
    try {
      toast.loading('Creating ₹2 test payment...', { id: 'test-payment' });
      
      const response = await fetch('/api/cashfree/test-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone: '9999999999',
          returnUrl: `${window.location.origin}/success?provider=cashfree&test=true`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Redirecting to ₹2 test payment...', { id: 'test-payment' });
        
        // Redirect to Cashfree test checkout
        const checkoutUrl = `${process.env.NODE_ENV === 'production' ? 'https://checkout.cashfree.com' : 'https://sandbox.cashfree.com'}/pay?cftoken=${data.cfToken}`;
        window.location.href = checkoutUrl;
      } else {
        const errorData = await response.json();
        toast.error(`Test payment failed: ${errorData.error}`, { id: 'test-payment' });
      }
    } catch (error) {
      toast.error('Failed to create test payment', { id: 'test-payment' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">AJ STUDIOZ Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage premium access and test payment system</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Premium Access Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Premium Access Management
              </CardTitle>
              <CardDescription>
                Grant or revoke premium access for students and special users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userEmail">User Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="student@university.edu"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Student access, Special promotion, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handlePremiumAction('grant')}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Grant Access
                </Button>
                
                <Button
                  onClick={() => handlePremiumAction('revoke')}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Revoke Access
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Badge variant="secondary" className="w-full justify-center">
                  Admin: kamesh6592@gmail.com
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Payment System Testing
              </CardTitle>
              <CardDescription>
                Test payment integration with small amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  ₹2 Test Payment
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                  Test the complete payment flow with a minimal ₹2 charge to verify:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside mb-4">
                  <li>Cashfree integration</li>
                  <li>Payment gateway redirect</li>
                  <li>Success/failure handling</li>
                  <li>Webhook processing</li>
                </ul>
                
                <Button
                  onClick={handleTestPayment}
                  disabled={testLoading}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {testLoading ? 'Creating...' : 'Start ₹2 Test Payment'}
                </Button>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Production Payment
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Regular checkout flow: ₹249 + GST<br/>
                  <a href="/pricing" className="text-yellow-600 dark:text-yellow-400 underline">
                    Go to Pricing Page →
                  </a>
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">₹2</div>
                    <div className="text-xs text-muted-foreground">Test Amount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">₹249</div>
                    <div className="text-xs text-muted-foreground">Live Amount</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" asChild>
                <a href="/api/health" target="_blank">
                  Check System Health
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/api/test-payment-config" target="_blank">
                  Payment Config Status
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/pricing" target="_blank">
                  View Pricing Page
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/checkout" target="_blank">
                  Test Checkout Flow
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}