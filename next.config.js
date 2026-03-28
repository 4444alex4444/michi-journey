/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    BOT_TOKEN: process.env.BOT_TOKEN,
  }
}
module.exports = nextConfig
