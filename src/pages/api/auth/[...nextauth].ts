import NextAuth from "next-auth"
import Providers from "next-auth/providers"

import { query } from 'faunadb'
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
        query.If(
          query.Not(
            query.Exists(
              query.Match(
                query.Index('user_by_email'),
                query.Casefold(email)
              )
            )
          ),
          query.Create(
            query.Collection('USERS'),
            { data: { email } }
          ),
          query.Get(
            query.Match(
              query.Index('user_by_email'),
              query.Casefold(email)
            )
          )
        ),
      ).then(() => true)
      .catch(() => false)

      return true
    },
  }
})