import Image from 'next/image'
import Link from 'next/link'
import { ActiveLink } from '../ActiveLink'

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
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>
                            Home
                        </a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts" prefetch >
                        <a>
                            Posts
                        </a>
                    </ActiveLink>
                </nav>

                <ButtonSingIn />
            </div>
        </header>
    )
}