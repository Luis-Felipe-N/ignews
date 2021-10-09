import Image from 'next/image'
import Link from 'next/link'

import { ButtonSingIn } from './ButtonSingIn'

import styles from './styles.module.scss'

export function Header() {
    return (
        <header className={styles.header}>
            <div>
                <Link href="/">
                    <Image 
                        src="/image/logo.svg"
                        width={90}
                        height={30}
                        alt="Logo"
                    />
                </Link>

                <nav>
                    <Link href="/">
                        <a className={styles.active}>Home</a>
                    </Link>
                    <Link href="/news">
                        <a>News</a>
                    </Link>
                </nav>

                <ButtonSingIn />
            </div>
        </header>
    )
}