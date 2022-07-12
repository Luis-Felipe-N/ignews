import { loadStripe }  from '@stripe/stripe-js'

export async function getStripeBrowser() {
    const stripeBrowser = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_APY_KEY)
    return stripeBrowser
}


 