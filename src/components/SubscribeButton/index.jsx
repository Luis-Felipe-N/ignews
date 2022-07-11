import { signIn } from 'next-auth/client'
import styles from './styles.module.scss'


export function SubscribeButton({ priceId }) {
    return (
        <button 
            
            className={styles.buttonSubscribe}>
                Subscribe Now
        </button>
    )
}