const withTM = require("next-transpile-modules")(["ui"]);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["i.pinimg.com", "cdn.discordapp.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API || "http://localhost:4000/:path*",
      },
    ];
  },
});
