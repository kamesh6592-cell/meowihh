'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { betterauthClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/use-location';
import { useSession } from '@/lib/auth-client';
import { useIsProUser } from '@/contexts/user-context';
import { PRICING } from '@/lib/constants';
import { getDiscountConfigAction } from '@/app/actions';
import { DiscountConfig } from '@/lib/discount';

const checkoutSchema = z.object({
  customer: z.object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
  billing: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State/Province must be at least 2 characters'),
    zipcode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.literal('IN'),
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [discountConfig, setDiscountConfig] = useState<DiscountConfig>({ enabled: false });
  const router = useRouter();
  const location = useLocation();
  const { data: session, isPending } = useSession();
  const { isProUser, isLoading: isProStatusLoading } = useIsProUser();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: {
        email: '',
        name: '',
      },
      billing: {
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'IN', // Always India
      },
    },
  });

  // Auto-populate email from session
  useEffect(() => {
    if (session?.user?.email) {
      form.setValue('customer.email', session.user.email);
    }
  }, [session, form]);

  // Fetch discount configuration
  useEffect(() => {
    const fetchDiscountConfig = async () => {
      try {
        const config = await getDiscountConfigAction();

        // Add original price if not already present (let edge config handle discount details)
        const isDevMode = config.dev || process.env.NODE_ENV === 'development';

        if ((config.enabled || isDevMode) && !config.originalPrice) {
          config.originalPrice = PRICING.PRO_MONTHLY;
        }
        setDiscountConfig(config);
      } catch (error) {
        console.error('Failed to fetch discount config:', error);
      }
    };

    fetchDiscountConfig();
  }, []);

  // Helper function to calculate discounted price
  const getDiscountedPrice = (originalPrice: number, isINR: boolean = false) => {
    const isDevMode = discountConfig.dev || process.env.NODE_ENV === 'development';
    const shouldApplyDiscount = isDevMode
      ? discountConfig.code && discountConfig.message
      : discountConfig.enabled && discountConfig.code && discountConfig.message;

    if (!shouldApplyDiscount) {
      return originalPrice;
    }

    // Use INR price directly if available
    if (isINR && discountConfig.inrPrice) {
      return discountConfig.inrPrice;
    }

    // Apply percentage discount
    if (discountConfig.percentage) {
      return Math.round(originalPrice - (originalPrice * discountConfig.percentage) / 100);
    }

    return originalPrice;
  };

  // Check if discount should be shown
  const shouldShowDiscount = () => {
    const isDevMode = discountConfig.dev || process.env.NODE_ENV === 'development';
    return isDevMode
      ? discountConfig.code && discountConfig.message && (discountConfig.percentage || discountConfig.inrPrice)
      : discountConfig.enabled &&
      discountConfig.code &&
      discountConfig.message &&
      (discountConfig.percentage || discountConfig.inrPrice);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    let lastError = null;
    
    try {
      // Try Cashfree first
      try {
        toast.loading('Creating secure payment session...', { id: 'checkout' });
        
        const cashfreeResponse = await fetch('/api/cashfree/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerPhone: '9999999999', // You can add phone field to form
            returnUrl: `${window.location.origin}/success?provider=cashfree`,
          }),
        });

        if (cashfreeResponse.ok) {
          const cashfreeData = await cashfreeResponse.json();
          toast.success('Redirecting to payment gateway...', { id: 'checkout' });
          
          // Redirect to Cashfree checkout
          const checkoutUrl = `${process.env.NODE_ENV === 'production' ? 'https://checkout.cashfree.com' : 'https://sandbox.cashfree.com'}/pay/${cashfreeData.cfToken}`;
          console.log('Redirecting to Cashfree checkout:', checkoutUrl);
          window.location.href = checkoutUrl;
          return;
        } else {
          const errorData = await cashfreeResponse.json().catch(() => ({}));
          lastError = new Error(`Cashfree: ${errorData.error || 'Service unavailable'}`);
        }
      } catch (cashfreeError) {
        lastError = cashfreeError as Error;
        console.log('Cashfree unavailable, trying DodoPayments...', cashfreeError);
      }

      // Fallback to DodoPayments
      try {
        toast.loading('Trying alternative payment method...', { id: 'checkout' });
        
        const { data: checkout, error } = await betterauthClient.dodopayments.checkout({
          slug: process.env.NEXT_PUBLIC_PREMIUM_SLUG || 'pro-plan-dodo',
          customer: {
            email: data.customer.email,
            name: data.customer.name,
          },
          billing: {
            city: data.billing.city,
            country: 'IN',
            state: data.billing.state,
            street: data.billing.street,
            zipcode: data.billing.zipcode,
          },
          referenceId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });

        if (error) {
          throw new Error(`DodoPayments: ${error.message || 'Product not found in dashboard'}`);
        }

        if (checkout?.url) {
          toast.success('Redirecting to payment gateway...', { id: 'checkout' });
          window.location.href = checkout.url;
          return;
        } else {
          throw new Error('DodoPayments: No checkout URL received');
        }
      } catch (dodoError) {
        // Both payment providers failed
        console.error('Both payment providers failed:', { lastError, dodoError });
        
        toast.dismiss('checkout');
        
        // Show specific error message
        if (dodoError instanceof Error && dodoError.message.includes('Product not found')) {
          toast.error('Payment configuration error: Product not set up in dashboard. Please contact support.');
        } else if (lastError && lastError.message.includes('authentication')) {
          toast.error('Payment service configuration error. Please contact support.');
        } else {
          toast.error('Payment services are temporarily unavailable. Please try again later or contact support.');
        }
        
        throw new Error('All payment providers failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Error already handled above with specific messages
    } finally {
      setIsLoading(false);
    }
  };  // Redirect if not authenticated
  if (!isPending && !session) {
    router.push('/sign-up');
    return null;
  }

  // Only show this page for Indian users
  if (!location.loading && !location.isIndia) {
    router.push('/pricing');
    return null;
  }

  // Redirect if user already has Pro access
  if (!isProStatusLoading && isProUser) {
    router.push('/');
    return null;
  }

  // Show loading while checking session, location, or Pro status
  if (isPending || location.loading || isProStatusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Back to Pricing Link */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link
          href="/pricing"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Pricing
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-8">
        <div className="text-center">
          {/* AJ STUDIOZ Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg ring-2 ring-blue-100 dark:ring-blue-800">
                <Image 
                  src="/aj-logo.jpg" 
                  alt="AJ STUDIOZ Logo" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">AJ STUDIOZ</h2>
                <p className="text-base text-zinc-600 dark:text-zinc-400">AI-Powered Research</p>
              </div>
            </div>
          </div>
          <h1 className="text-[2rem] font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">
            Upgrade to Pro
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            Unlock unlimited AI-powered research for just ₹249
          </p>

          {/* What You Get */}
          <div className="mt-8 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 text-center">
                🚀 What you get with Pro
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 dark:text-blue-200">Unlimited AI searches</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-800 dark:text-purple-200">All AI models</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 dark:text-green-200">PDF analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-800 dark:text-orange-200">Priority support</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                  💳 Secure payment with UPI, Cards, Net Banking • ⚡ Instant activation
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 opacity-50">
            <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-6 py-3 rounded-full text-base font-medium">
              🚀 Special Launch Price:{' '}
              {shouldShowDiscount() ? (
                <>
                  <span className="line-through text-muted-foreground mr-2">₹{PRICING.PRO_MONTHLY_INR}</span>₹
                  {getDiscountedPrice(PRICING.PRO_MONTHLY_INR, true)}
                </>
              ) : (
                <span className="ml-2 font-bold text-lg">₹{PRICING.PRO_MONTHLY_INR}</span>
              )}{' '}
              <span className="ml-2">for 1 month access</span>
            </div>
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>GST and tax details will be calculated and shown during checkout</p>
              <p>
                Prefer a subscription?{' '}
                <Link href="/pricing" className="underline hover:text-foreground">
                  Choose monthly billing instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-xl">Billing Information</CardTitle>
            </div>
            <CardDescription className="text-base">Complete your details for secure checkout • Only takes 2 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Customer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              {...field}
                              disabled
                              className="bg-zinc-50 dark:bg-zinc-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Address</h3>
                  <FormField
                    control={form.control}
                    name="billing.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street, Apartment 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billing.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billing.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Maharashtra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billing.zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="400001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billing.country"
                      render={() => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input value="India" disabled className="bg-zinc-50 dark:bg-zinc-900" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-blue-100 dark:border-blue-800">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-900 dark:text-blue-100">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{PRICING.PRO_MONTHLY_INR}</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Includes all taxes • 30-day money-back guarantee</p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-3" />
                        Complete Purchase - ₹{PRICING.PRO_MONTHLY_INR}
                      </>  
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      🔒 SSL Secured
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      ⚡ Instant Activation
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      💳 All Payment Methods
                    </span>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tax Information Notice */}
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>📄 Tax & Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>GST and applicable taxes will be calculated automatically during checkout</li>
                <li>Tax breakdown will be clearly displayed before final payment confirmation</li>
                <li>A detailed invoice with all charges and tax details will be sent to your email</li>
                <li>Invoice will include GST registration details as per Indian tax regulations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-4 inline-block">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              🔒 Secure checkout powered by{' '}
              <Link
                href="https://dodopayments.com"
                target="_blank"
                className="underline hover:text-foreground transition-colors"
              >
                DodoPayments
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
