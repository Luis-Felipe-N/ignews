import { signIn, useSession } from 'next-auth/client'
import { api } from '../../service/api'
import { getStripeBrowser } from '../../service/stripeBrowser'
import styles from './styles.module.scss'


export function SubscribeButton({ priceId }) {

    const [ session ] = useSession()

    async function handleSubscribe() {
        if (!session) {
            signIn()
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