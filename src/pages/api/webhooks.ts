import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../service/stripe";

async function buffer(readable: Readable){
    const chunks = [];
  
    for await (const chunk of readable){
      chunks.push(
        typeof chunk === 'string' ? Buffer.from(chunk) : chunk
      );
    }
  
    return Buffer.concat(chunks);
  }
  
  export const config = {
    api: {
      bodyParser: false
    }
  }
  
  const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ]);

export default async function WebHooks(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']
    
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOKS_SECRET)

            const type = event.type

            if (relevantEvents.has(type)) {
                console.log(type)
            }

            
        } catch (error) {
            return res.status(400). send(`Webhook error ${error.message}`)
        }
        res.json({ok: true})
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }


    res.status(200).json({ ok: true})
}