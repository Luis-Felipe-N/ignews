import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../service/fauna";
import { stripe } from '../../service/stripe'

interface IUser {
    ref: {
        id: string
    },
    data: {
        stripe_custumer_id: string
    }
}

async function subscribe(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const session = await getSession({req})

        const user = await fauna.query<IUser>(
            query.Get(
                query.Match(query.Index('user_by_email'), query.Casefold(session.user.email))
            )
        )

        let customerId = user.data.stripe_custumer_id

        if (!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
            })
            
            await fauna.query(
                query.Update(
                    query.Ref(query.Collection('USERS'), user.ref.id),
                    { 
                        data: {
                            stripe_custumer_id: customerId,
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }

        
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: "required",
            line_items: [{
                price: 'price_1JSOSILrWUWGbys9N5Y0KhXS',
                quantity: 1
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })            
    
        return res.status(200).json({ sessionId: checkoutSession.id})
    } else {
        res.setHeader('Allow', 'POST')
        return res.status(405).end('Method not allowed')
    }
}

export default subscribe