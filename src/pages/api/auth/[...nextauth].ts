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
        query.Create(
          query.Collection('USERS'),
          { data: { email } }
        )
      ).then((ret) => console.log(ret))
      .catch((err) => console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
      ))

      return true
    },
  }
})