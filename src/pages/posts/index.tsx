import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import { useEffect, useState } from 'react'
import { createClient } from '../../service/prismicio'
import style from './style.module.scss'

interface IPost {
    uid: string,
    date: Date,
    title: string,
    exerpt: string
}

interface IPostsProps {
    posts: IPost[]
}

export default function Posts({posts}: IPostsProps) {
    const [hasSubscription, setHasSubscription] = useState(false)
    const [session] = useSession()
    const { push } = useRouter()
    useEffect(() => {
        if(session?.activeSubscription) {
            setHasSubscription(true)
        }
    }, [session])

    return (
        <>
            <Head>
                <title>Ignews | Posts</title>
            </Head>
            <main className={style.posts}>
                <div>
                    {
                        posts &&
                        posts.map(post => (
                            <Link key={post.uid} href={hasSubscription ? `/posts/${post.uid}` : `/posts/preview/${post.uid}`}>
                                <a>
                                    <time>{post.date}</time>
                                    <strong>{post.title}</strong>
                                    <p>{post.exerpt}</p>
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </main>
        </>
    )
}
export const getStaticProps: GetStaticProps = async () => {
    const client = createClient()
    const documents = await client.getAllByType('post')

    const posts = documents.map(post => {
        return {
            uid: post.uid,
            date: new Date(post.last_publication_date).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
        }
    })

    documents.forEach(post => console.log(post))

    return {
        props: {
            posts
        }
    }
}