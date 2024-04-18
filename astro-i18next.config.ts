/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
    defaultLocale: "fi",
    locales: ["fi", "en"],
    namespaces: [
      "account",
      "actions",
      "app",
      "entries",
      "navigation", 
      "profile",
      "sites"],
    defaultNamespace: "actions",
  };