export const routes = {
  home: "/",
  about: "/about",
  secret: (id: string) => `/secret/${id}`,
  privacy: "/privacy",
  terms: "/terms",

  // API routes
  api: {
    secrets: "/api/secrets",
    secret: (id: string) => `/api/secrets/${id}`,
  },
}

