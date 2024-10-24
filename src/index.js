export default {
  async fetch(request) {
    class TagRewriter {
      constructor(src) {
        this.src = src
      }

      element(element) {
        const src = element.getAttribute(this.src)

        element.setAttribute('data-script', 'true')
        if (src) element.tagName = 'template' 
      }
    }

    const rewriter = new HTMLRewriter().on('script', new TagRewriter('src'))

    const response = await fetch(request)
    const contentType = response.headers.get('Content-Type') || ''
    const url = new URL(request.url)
    
    console.log('Pahtname: ', url.pathname)
    console.log('Test include: ', url.pathname.includes('/ShoppingCart'))

    if (contentType.includes('text/html') && !url.pathname.includes('/ShoppingCart')) {
      return rewriter.transform(response)
    } else {
      return response
    }
  },
}
