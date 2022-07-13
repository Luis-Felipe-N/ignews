import { GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { createClient } from "../../../service/prismicio"

import style from '../post.module.scss'

interface IPostProps {
    post: {
        title: string;
        uid: string, 
        date: string;
        dateISO: string;
        content: string;
    }
}

export default function Post({post}: IPostProps) {
    const [session] = useSession()
    const { push } = useRouter()
    useEffect(() => {
        if(session?.activeSubscription) {
            push(`/posts/${post.uid}`)
        }
    }, [session, post.uid, push])

    return (
        <div className={style.post}>
            <article>
                <h1>{post.title}</h1>
                <time dateTime={post.dateISO}>{post.date}</time>
                <div className={style.previewcontent} dangerouslySetInnerHTML={{__html: post.content}}></div>
                <div className={style.wannaSubscribe}>Wanna continue reading? <Link href={'/'}><a>Subscribe now</a></Link></div>
            </article>
        </div>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

    if (params?.slug) {
        const { slug } = params
        const client = createClient()
        const document = await client.getByUID('post', String(slug))
    
        const post = {
                uid: document.uid,
                dateISO: document.last_publication_date,
                date: new Date(document.last_publication_date).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                title: RichText.asText(document.data.title),
                content: RichText.asHtml(document.data.content.slice(0, 3))
            }
    
        return {
            props: {
                post
            }
        }
    }

    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    }
}