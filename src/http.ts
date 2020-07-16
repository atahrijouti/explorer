const buildFetch = (method: "get" | "post" | "put" | "patch" | "delete") => {
  return async (url: string, options?: RequestInit | undefined) => {
    const result = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    })
    let response = null
    try {
      response = await result.json()
    } catch (e) {}
    return response
  }
}

export const Http = {
  get: buildFetch("get"),
  post: buildFetch("post"),
  put: buildFetch("put"),
  patch: buildFetch("patch"),
  delete: buildFetch("delete"),
}
