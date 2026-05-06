/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://caspian-routes.com',
  generateRobotsTxt: true,
  defaultChangefreq: 'weekly',
  defaultPriority: 0.7,
  locales: ['ru', 'en', 'az'],
  defaultLocale: 'en',
  exclude: [
    '/admin',
    '/admin/*',
    '/partner-portal',
    '/partner-portal/*',
    '/partner-dashboard',
    '/partner-dashboard/*',
    '/partner-quote',
    '/partner-quote/*',
    '/dashboard',
    '/dashboard/*',
    '/profile',
    '/auth',
    '/auth/*',
  ],
}