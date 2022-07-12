import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../service/stripe";
import manageSubscribe from "./_lib/manageSubscription";

async function buffer(readable: Readable){
    const chunks = [];
  
    for await (const chunk of readable){
      chunks.push(
        typeof chunk === "string" ? Buffer.from(chunk) : chunk
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
    // 'customer.subscription.created',
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
        } catch (error) {
            return res.status(400). send(`Webhook error ${error.message}`)
        }

        const type = event.type

        if (relevantEvents.has(type)) {
          try {
            switch (type) {
              case 'customer.subscription.created':
              case 'customer.subscription.updated':
              case 'customer.subscription.deleted':

                const subscription = event.data.object as Stripe.Subscription

                await manageSubscribe(
                  subscription.id,
                  subscription.customer.toString(),
                  type === 'customer.subscription.created'
                )

                break;
              case 'checkout.session.completed':
                
                const checkouSession = event.data.object as Stripe.Checkout.Session

                await manageSubscribe(
                  checkouSession.subscription.toString(),
                  checkouSession.customer.toString(),
                  true
                )

                break;
              default:
                throw new Error("Webhook type faield");
            }
          } catch (error) {
            return res.json({error})
          }
        }        

        res.json({ok: true})
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}