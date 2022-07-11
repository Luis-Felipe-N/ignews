import { signIn, useSession } from 'next-auth/client'
import styles from './styles.module.scss'


export function SubscribeButton({ priceId }) {

    cosnst [ session ] = useSession()

    function handleSubscribe() {
        if (!session) {
            signIn()
            return
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