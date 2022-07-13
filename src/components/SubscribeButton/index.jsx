import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { api } from '../../service/api'
import { getStripeBrowser } from '../../service/stripeBrowser'
import styles from './styles.module.scss'


export function SubscribeButton({ priceId }) {

    const [ session ] = useSession()
    const {push} = useRouter()

    async function handleSubscribe() {
        if (!session) {
            signIn()
            return
        }

        if (session.activeSubscription) {
            push('/posts')
            return
        }

        try {
            const response = await api.post('/subscribe')
            console.log(response)
            
            const { sessionId } = response.data
            const stripeBrowser = await getStripeBrowser()

            await stripeBrowser.redirectToCheckout({ sessionId })
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <button 
            onClick={handleSubscribe}
            className={styles.buttonSubscribe}>
                Subscribe Now
        </button>
    )
}