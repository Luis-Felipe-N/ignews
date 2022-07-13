import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom"
import { createClient } from "../../service/prismicio"

import style from './post.module.scss'

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
    console.log(post)
    return (
        <div className={style.post}>
            <article>
                <h1>{post.title}</h1>
                <time dateTime={post.dateISO}>{post.date}</time>
                <div dangerouslySetInnerHTML={{__html: post.content}}></div>
            </article>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params, previewData}) => {
    const session = await getSession({req})

    console.log(session)
    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: '/',
                permanent: false,

            }
        }
    }

    const client = createClient({previewData})
    const document = await client.getByUID('post', String(params.slug))

    const post = {
            uid: document.uid,
            dateISO: document.last_publication_date,
            date: new Date(document.last_publication_date).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            title: RichText.asText(document.data.title),
            content: RichText.asHtml(document.data.content)
        }

    return {
        props: {
            post
        }
    }
}