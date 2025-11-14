'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Shield, Users, UserPlus, UserX, CreditCard, TestTube, Crown, UserMinus,
  Search, ChevronLeft, ChevronRight, Mail 
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isProUser: boolean;
  proSource?: string;
  proExpiresAt?: string;
  lastSignIn: string;
}

interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [pagination, setPagination] = useState<UsersPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual access state
  const [userEmail, setUserEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!isPending && (!session || session.user.email !== 'kamesh6592@gmail.com')) {
      router.push('/sign-in?redirect=/admin');
    }
  }, [session, isPending, router]);

  // Fetch users when tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(1, '');
    }
  }, [activeTab]);

  // Fetch users function
  const fetchUsers = async (page = 1, search = '') => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });
      
      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users on mount and when search changes
  useEffect(() => {
    if (session?.user.email === 'kamesh6592@gmail.com') {
      fetchUsers(1, searchQuery);
    }
  }, [session, searchQuery]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchUsers(newPage, searchQuery);
  };

  // Show loading while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!session || session.user.email !== 'kamesh6592@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            This admin panel is restricted to authorized personnel only.
          </p>
          <button 
            onClick={() => router.push('/sign-in?redirect=/admin')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handlePremiumAction = async (action: 'grant' | 'revoke', email?: string) => {
    const targetEmail = email || userEmail.trim();
    
    if (!targetEmail) {
      toast.error('Please enter user email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/premium-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: targetEmail,
          action,
          reason: reason.trim() || `${action === 'grant' ? 'Manual grant' : 'Manual revoke'} by admin`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Successfully ${action === 'grant' ? 'granted' : 'revoked'} premium access for ${targetEmail}`);
        setUserEmail('');
        setReason('');
        // Refresh users list
        fetchUsers(pagination.page, searchQuery);
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
        
        // Use the payment session ID or cf_token for checkout URL
        const sessionId = data.paymentSessionId || data.cfToken;
        const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app');
        const checkoutUrl = `${isProduction ? 'https://checkout.cashfree.com' : 'https://sandbox.cashfree.com'}/pay/session/${sessionId}`;
        console.log('Test payment redirect URL:', checkoutUrl);
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

  const handleTestEmail = async () => {
    if (!testEmailAddress.trim()) {
      toast.error('Please enter a test email address');
      return;
    }

    setEmailLoading(true);
    try {
      toast.loading('Sending test email notifications...', { id: 'test-email' });
      
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testEmail: testEmailAddress.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Test emails sent successfully!', { id: 'test-email' });
        setTestEmailAddress('');
      } else {
        const errorData = await response.json();
        toast.error(`Test email failed: ${errorData.error}`, { id: 'test-email' });
      }
    } catch (error) {
      toast.error('Failed to send test email', { id: 'test-email' });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-lg ring-2 ring-blue-100 dark:ring-blue-800">
              <Image 
                src="/aj-logo.jpg" 
                alt="AJ STUDIOZ Logo" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold">AJ STUDIOZ Admin Panel</h1>
            </div>
          </div>
          <p className="text-muted-foreground">Comprehensive system administration and user management</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Premium Access
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Testing
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  All Users
                </CardTitle>
                <CardDescription>
                  View and manage all registered users. Grant or revoke premium access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search users by email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => fetchUsers(1, searchQuery)}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    Search
                  </Button>
                </div>

                {/* Users Table */}
                {usersList.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registration</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usersList.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={user.image || ''} />
                                    <AvatarFallback className="text-xs">
                                      {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name || 'No name'}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {user.isPro ? (
                                    <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                      <Crown className="w-3 h-3 mr-1" />
                                      PRO
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Free</Badge>
                                  )}
                                  {user.emailVerified && (
                                    <Badge variant="outline" className="text-green-600 border-green-200">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {user.isPro ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handlePremiumAction('revoke', user.email)}
                                      disabled={isLoading}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <UserMinus className="w-4 h-4 mr-1" />
                                      Revoke Pro
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => handlePremiumAction('grant', user.email)}
                                      disabled={isLoading}
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                    >
                                      <Crown className="w-4 h-4 mr-1" />
                                      Grant Pro
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} users
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchUsers(pagination.page - 1, searchQuery)}
                          disabled={pagination.page <= 1 || isLoading}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                            const pageNum = pagination.page - 2 + i;
                            if (pageNum < 1 || pageNum > Math.ceil(pagination.total / pagination.limit)) return null;
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === pagination.page ? "default" : "outline"}
                                size="sm"
                                onClick={() => fetchUsers(pageNum, searchQuery)}
                                disabled={isLoading}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchUsers(pagination.page + 1, searchQuery)}
                          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading users...
                      </div>
                    ) : searchQuery ? (
                      'No users found matching your search.'
                    ) : (
                      'No users found. Click search to load users.'
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Premium Access Tab */}
          <TabsContent value="access" className="space-y-6">
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
          </TabsContent>

          {/* Payment Testing Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Payment System Testing
                </CardTitle>
                <CardDescription>
                  Test payment integration and email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    ₹2 Test Payment
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Test Cashfree integration with minimal amount to verify:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 mb-4">
                    <li>• Payment gateway connection</li>
                    <li>• Redirect flow</li>
                    <li>• Success/failure handling</li>
                    <li>• Webhook processing</li>
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

                {/* Email Testing Section */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    📧 Email Notification Testing
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="testEmail">Test Email Address</Label>
                      <Input
                        id="testEmail"
                        type="email"
                        placeholder="user@example.com"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleTestEmail}
                      disabled={emailLoading || !testEmailAddress}
                      variant="outline"
                      className="w-full"
                    >
                      {emailLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      {emailLoading ? 'Sending...' : 'Send Test Email Notification'}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      This will send a test order confirmation email to the specified address and admin notification to kamesh6592@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <a href="/api/debug/cashfree-test" target="_blank">
                  Test Cashfree API
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