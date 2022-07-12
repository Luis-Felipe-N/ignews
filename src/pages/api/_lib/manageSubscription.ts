import { query as q } from "faunadb";
import { fauna } from "../../../service/fauna";
import { stripe } from "../../../service/stripe";

interface IUser {
    ref: {
        id: string
    },

}

export default async function manageSubscribe(subscribeId: string, customerId: string, createAction = false) {
    const userRef = await fauna.query<IUser>(
        q.Select(
            "ref",
            q.Get(
                q.Match(q.Index('stripe_customer_id'), customerId),
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscribeId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        priceId:  subscription.items.data[0].price.id,
        status: subscription.status
    }

    if (createAction) {
        await fauna.query(
            q.Create(
                q.Collection('SUBSCRIPTION'), 
                {
                    data: subscriptionData
                }
            )
        )
    } else {
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_id'),
                            subscribeId
                        )
                    )
                ),
                {
                    data: subscriptionData
                }
            )
        )
    }    
}