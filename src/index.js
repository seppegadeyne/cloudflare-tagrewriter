export default {
  async fetch(request) {
    class TagRewriter {
      element(element) {
        element.setAttribute('data-modified', new Date())
        if (element.src) element.tagName = 'template' 
        console.log(`Found script v3: ${element.tagName} / ${element.src}`)
      }
    }

    const rewriter = new HTMLRewriter().on('script', new TagRewriter())

    const response = await fetch(request)
    const contentType = response.headers.get('Content-Type') || ''

    if (contentType.includes('text/html')) {
      return rewriter.transform(response)
    } else {
      return response
    }
  },
}
