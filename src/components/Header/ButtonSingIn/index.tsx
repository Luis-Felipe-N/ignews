import { useSession, signIn, signOut } from "next-auth/client"

import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export function ButtonSingIn() {
    const [ session ] = useSession()

    console.log(session)

    return session ? (
        <button 
            title="Sair"
            onClick={() => signOut()}
            className={styles.buttonsingIn}>
            <FaGithub color="#04d361" />
                {session.user.name}
            <FiX /> 
        </button>
    ) : (
        <button 
            onClick={() => signIn()}
            className={styles.buttonsingIn}>
            <FaGithub color="#eba417" />
            Sing In with GitHub
        </button>
    )
}