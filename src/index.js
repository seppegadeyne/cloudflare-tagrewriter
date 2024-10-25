export default {
	async fetch(request) {
		class TagRewriter {
			constructor(src, priority) {
				this.src = src
				this.priority = priority
			}

			element(element) {
				const src = element.getAttribute(this.src)

				if (src) {
					element.setAttribute('data-script', 'true')
					element.setAttribute('data-priority', this.priority)
					element.tagName = 'template'
				}
			}
		}

		class TagRemover {
			element(element) {
				element.remove()
			}
		}

		const rewriter = new HTMLRewriter()
			.on('script', new TagRewriter('src', 1))
			.on('a[href="https://www.rentpro.nl"]', new TagRemover())

		const response = await fetch(request)
		const contentType = response.headers.get('Content-Type') || ''
		const url = new URL(request.url)

		// console.log('Pahtname: ', url.pathname)
		// console.log('Test include ShoppingCart: ', url.pathname.includes('/shoppingcart'))

		if (contentType.includes('text/html') && !url.pathname.includes('/shoppingcart')) {
			return rewriter.transform(response)
		} else {
			return response
		}
	}
}
