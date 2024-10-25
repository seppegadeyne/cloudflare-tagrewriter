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
					element.setAttribute('data-tag', 'script')
					element.setAttribute('data-priority', this.priority)
					element.tagName = 'template'
				}

				if (!src && this.priority === 2) {
					element.setAttribute('data-tag', 'script')
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

		const rewriterOne = new HTMLRewriter()
			.on('head script', new TagRewriter('src', 1))
			.on('body script', new TagRewriter('src', 2))
			.on('a[href="https://www.rentpro.nl"]', new TagRemover())

		const rewriterTwo = new HTMLRewriter().on('a[href="https://www.rentpro.nl"]', new TagRemover())

		const response = await fetch(request)
		const contentType = response.headers.get('Content-Type') || ''
		const url = new URL(request.url)

		if (contentType.includes('text/html') && !url.pathname.startsWith('/shoppingcart')) {
			return rewriterOne.transform(response)
		} else {
			return rewriterTwo.transform(response)
		}
	}
}
