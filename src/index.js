export default {
	async fetch(request) {
		class TagRewriter {
			constructor(src, priority) {
				this.src = src
				this.priority = priority
			}

			element(element) {
				const src = element.getAttribute(this.src)

				if (src && !src.match(/https:\/\/.*jquery.*\.js/)) {
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

		class TagInserter {
			element(element) {
				element.prepend(
					`<script>
						document.addEventListener("DOMContentLoaded", function () {
						    function loadJavaScript(e, o) {
								return new Promise(function(n) {
									var r = document.createElement("script");
									r.type = "text/javascript";
									r.async = true;
									r.src = e;
									r.id = o;
									r.onload = n;
									document.head.appendChild(r);
								});
							}

							function loadTemplateScripts() {
								const templates = Array.from(document.querySelectorAll('template[data-tag="script"]'))
									.sort((a, b) => a.getAttribute('data-priority') - b.getAttribute('data-priority'));

								let scriptsLoaded = 0;

								templates.forEach((template, index) => {
									const script = document.createElement('script');
									const src = template.getAttribute('src');
									if (src) {
										script.src = src;
										script.async = true;

										script.onload = () => {
											scriptsLoaded++;
											if (scriptsLoaded === templates.length) {
												document.querySelector(".prdReviewShowAll")?.addEventListener("click", function () {
													document.querySelectorAll(".prdReview").forEach(function (element) {
														element.style.display = "block";
													});
													this.style.display = "none";
												});

												document.querySelector(".prdPlaceReview")?.addEventListener("click", function () {
													document.querySelector("#prdPlaceReviewDiv").style.display = "block";
													this.style.display = "none";
												});

												document.querySelector("#ss-youtube")?.addEventListener("click", function () {
													ssYouTube();
												});
											}
										};
									}

									document.head.appendChild(script);
									template.remove();
								});

								window.$zopim || loadJavaScript("https://v2.zopim.com/?3rxfUWDGLtWlU6QTLB2TP2vGrQSZ90Go", "zopim-chat");
							}

							window.addEventListener('scroll', loadTemplateScripts, { once: true });
							window.addEventListener('mousemove', loadTemplateScripts, { once: true });
						});
					</script >`,
					{ html: true }
				)
			}
		}

		/*
		// Development
		const targetURL = 'https://www.verhuurwinkel.nl/silent-disco-huren'
		const targetRequest = new Request(targetURL, {
			method: request.method,
			headers: request.headers
		})
		const response = await fetch(targetRequest)
		const url = new URL(targetURL)
		*/

		// Production
		const response = await fetch(request)
		const url = new URL(request.url)

		const contentType = response.headers.get('Content-Type') || ''

		/*
			.on('head script', new TagRewriter('src', 1))
			.on('body script', new TagRewriter('src', 2))
		*/

		const rewriterOne = new HTMLRewriter()
			.on('head', new TagInserter())
			.on('a[href="https://www.rentpro.nl"]', new TagRemover())

		const rewriterTwo = new HTMLRewriter()
			.on('a[href="https://www.rentpro.nl"]', new TagRemover())
			.on('head', new TagInserter())

		if (contentType.includes('text/html') && !url.pathname.startsWith('/shoppingcart')) {
			return rewriterOne.transform(response)
		} else {
			return rewriterTwo.transform(response)
		}
	}
}
