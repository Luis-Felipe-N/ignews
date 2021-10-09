import styles from '../styles/pages/home.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from '../components/SubscribeButton'
import { GetStaticProps } from 'next'
import { stripe } from '../service/stripe'

interface HomeProps {
  product: {
    priceId: string,
    amount: number
}
  }


export default function Home({ product }: HomeProps ) {

  return (
    <>
    <Head>
      <title>
        Home
      </title>
    </Head>

    <main className={styles.home}>
      <section>
        <span>👏 Hey, Welcome</span>
        <h1>News About the <span className={styles.blue}>React</span> word.</h1>
        <p>Get access to all publications <br /> <span className={styles.blue}>for ${product.amount} month</span></p>
        <SubscribeButton priceId={product.priceId} />
      </section>
      <Image 
        src="/image/avatar.svg"
        width={500}
        height={600}
       />
    </main>
    </>  
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JSOSILrWUWGbys9N5Y0KhXS', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100
  }

  return {
    props: {
      product
    },revalidate: 60 * 60 * 24 // 24horas

  }
}