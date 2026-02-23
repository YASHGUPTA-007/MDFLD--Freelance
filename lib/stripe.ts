// lib/stripe.ts

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
});

export default stripe;

/**
 * Creates a Stripe coupon for a discount code.
 * percent_off: 1–100
 * max_redemptions: optional, null = unlimited
 */
export async function createStripeCoupon(
    code: string,
    percentOff: number,
    maxRedemptions: number | null
): Promise<Stripe.Coupon> {
    const params: Stripe.CouponCreateParams = {
        id: `MDFLD_${code}`,
        percent_off: percentOff,
        duration: 'once',
        name: code,
        ...(maxRedemptions ? { max_redemptions: maxRedemptions } : {}),
    };

    return await stripe.coupons.create(params);
}

/**
 * Deletes a Stripe coupon by its Stripe ID.
 * Silently ignores if coupon doesn't exist on Stripe.
 */
export async function deleteStripeCoupon(stripeCouponId: string): Promise<void> {
    try {
        await stripe.coupons.del(stripeCouponId);
    } catch (err: unknown) {
        const stripeErr = err as Stripe.StripeRawError;
        if (stripeErr?.code !== 'resource_missing') {
            throw err;
        }
        // Already deleted on Stripe — safe to ignore
    }
}