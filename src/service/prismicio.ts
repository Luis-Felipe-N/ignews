import * as prismic from '@prismicio/client'    

export function createClient(config = {}) {
const client = prismic.createClient(process.env.PRISMIC_ENDPOINTER, {
    ...config,
})

// enableAutoPreviews({
//   client,
//   previewData: config.previewData,
//   req: config.req,
// })

return client
}
