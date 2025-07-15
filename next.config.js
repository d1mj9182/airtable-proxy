module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; connect-src 'self' https://mcs.zijieapi.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.tiktok.com; img-src *; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
