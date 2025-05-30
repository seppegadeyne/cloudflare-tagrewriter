export default {
	async fetch(request) {
		class TagRemover {
			element(element) {
				element.remove()
			}
		}

		class TagInserter {
			element(element) {
				element.append(
					`<script type="text/javascript" id="ss-custom-js">
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

							document.querySelector("#ss-youtube")?.addEventListener("click", function () {
								ssYouTube();
							});

							function loadScripts() {
								window.$zopim || loadJavaScript("https://v2.zopim.com/?3rxfUWDGLtWlU6QTLB2TP2vGrQSZ90Go", "zopim-chat");
								loadJavaScript("https://app.masslytics.io/masslytics.js", "masslytics");
								window.removeEventListener("scroll", loadScripts);
								window.removeEventListener("mousemove", loadScripts);
							}

							window.masslyticsBrandId = "SW-026110";
							window.addEventListener('scroll', loadScripts, { once: true });
							window.addEventListener('mousemove', loadScripts, { once: true });
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
		*/

		// Production
		const response = await fetch(request)

		const rewriter = new HTMLRewriter()
			.on('body', new TagInserter())
			.on('a[href="https://www.rentpro.nl"]', new TagRemover())

		return rewriter.transform(response)
	}
}
