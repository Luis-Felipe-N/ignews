import NextAuth from "next-auth"
import Providers from "next-auth/providers"

import { query as q } from 'faunadb'
import { fauna } from '../../../service/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    signIn(user, account, profile) {
      const { email } = user

      fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          ),
          q.Create(
            q.Collection('USERS'),
            { data: { email } }
          ),
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(email)
            )
          )
        ),
      ).then(() => true)
      .catch(() => false)

      return true
    },
    async session(session, userOrToken) {

      try {
        const subscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_user_id'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      session.user.email
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_active'),
                'active'
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription: subscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }

    },
  }
})