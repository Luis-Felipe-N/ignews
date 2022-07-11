import { AppProps } from 'next/app';
import { Header } from '../components/Header';

import { Provider as SessionNextAuthProvider } from 'next-auth/client'

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionNextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionNextAuthProvider>
  )
}

export default MyApp