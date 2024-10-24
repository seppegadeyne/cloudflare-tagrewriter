export default {
	async fetch(request) {
		class ScriptRewriter {
			constructor(src) {
				this.src = src
			}

			element(element) {
				const src = element.getAttribute(this.src)

				if (src) {
					element.tagName = 'template'
					console.log(`Found script: ${src}`)
				}
			}
		}

		const rewriter = new HTMLRewriter().on('script', new ScriptRewriter('src'))

		const response = await fetch(request)
		const contentType = response.headers.get('Content-Type') || ''

		if (contentType.includes('text/html')) {
			console.log('Rewriting HTML v1')
			return rewriter.transform(response)
		} else {
			console.log('Skipping HTML rewrite v1')
			return response
		}
	}
}
