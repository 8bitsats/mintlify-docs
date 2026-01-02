addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const urlObject = new URL(request.url);
    // If the request is to the docs subdirectory
    if (/^\/docs/.test(urlObject.pathname)) {
      // Then Proxy to Mintlify
      const DOCS_URL = "funpump.mintlify.dev";
      const CUSTOM_URL = "docs.funpump.ai";

      let url = new URL(request.url);
      url.hostname = DOCS_URL;

      let proxyRequest = new Request(url, request);

      proxyRequest.headers.set("Host", DOCS_URL);
      proxyRequest.headers.set("X-Forwarded-Host", CUSTOM_URL);
      proxyRequest.headers.set("X-Forwarded-Proto", "https");

      return await fetch(proxyRequest);
    }
  } catch (error) {
    // if error occurs, return the regular request
    return await fetch(request);
  }

  // If path doesn't match /docs, return the regular request
  return await fetch(request);
}

