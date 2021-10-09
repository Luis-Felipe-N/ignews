import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function ButtonSingIn() {
    const [ isUserLoggedIn, setIsUserLoggedIn ] = useState(true)


    return isUserLoggedIn ? (
        <button className={styles.buttonsingIn}>
            <FaGithub color="#04d361" />
            Luis Felipe
            <FiX /> 
        </button>
    ) : (
        <button className={styles.buttonsingIn}>
            <FaGithub color="#eba417" />
            Sing In with GitHub
        </button>
    )
}