export default {
  async fetch(request) {
    class TagRewriter {
      element(element) {
        element.setAttribute('data-modified', new Date().toUTCString())
        element.tagName = 'template' 
        console.log(`Found script v2: ${element.tagName} / ${element.src}`)
      }
    }

    const rewriter = new HTMLRewriter().on('script', new TagRewriter())

    const response = await fetch(request)
    const contentType = response.headers.get('Content-Type') || ''

    if (contentType.includes('text/html')) {
      console.log('Rewriting HTML v2')
      return rewriter.transform(response)
    } else {
      console.log('Skipping HTML rewrite v2')
      return response
    }
  },
}
