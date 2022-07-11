import { loadStripe }  from '@stripe/stripe-js'

export async function getStripeBrowser() {
    console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_APY_KEY)
    const stripeBrowser = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_APY_KEY)
    return stripeBrowser
}


 