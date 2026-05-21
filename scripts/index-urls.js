const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const urls = [
  'https://www.caspian-routes.com/ru',
  'https://www.caspian-routes.com/en',
  'https://www.caspian-routes.com/az',
  'https://www.caspian-routes.com/tr',
  'https://www.caspian-routes.com/ru/blog',
  'https://www.caspian-routes.com/en/blog',
  'https://www.caspian-routes.com/tr/blog',
  'https://www.caspian-routes.com/ru/planner',
  'https://www.caspian-routes.com/en/planner',
  'https://www.caspian-routes.com/tr/planner',
  'https://www.caspian-routes.com/ru/blog/marshrut-baku-1-den',
  'https://www.caspian-routes.com/ru/blog/marshrut-baku-3-dnya',
  'https://www.caspian-routes.com/ru/blog/baku-letom',
  'https://www.caspian-routes.com/ru/blog/baku-zima',
  'https://www.caspian-routes.com/ru/blog/gabala-zima',
  'https://www.caspian-routes.com/ru/blog/gobustan-kak-dobratsa',
  'https://www.caspian-routes.com/ru/blog/sheki-za-1-den',
  'https://www.caspian-routes.com/ru/blog/oteli-baku-more',
  'https://www.caspian-routes.com/ru/blog/skolko-stoit-baku',
  'https://www.caspian-routes.com/ru/blog/restorany-baku',
  'https://www.caspian-routes.com/ru/blog/azerbaydzhan-7-dney',
  'https://www.caspian-routes.com/ru/blog/plyazhi-azerbaydzhana',
  'https://www.caspian-routes.com/ru/blog/viza-v-azerbaydzhan',
  'https://www.caspian-routes.com/ru/blog/bezopasnost-azerbaydzhan',
  'https://www.caspian-routes.com/ru/blog/chto-nelzya-v-azerbaydzhane',
  'https://www.caspian-routes.com/ru/blog/marshrut-baku-tbilisi',
  'https://www.caspian-routes.com/ru/blog/lankaran',
  'https://www.caspian-routes.com/ru/blog/azerbaydzhan-eda',
  'https://www.caspian-routes.com/ru/blog/azerbaydzhan-s-detmi',
  'https://www.caspian-routes.com/en/blog/baku-1-day',
  'https://www.caspian-routes.com/en/blog/baku-3-days',
  'https://www.caspian-routes.com/en/blog/baku-summer',
  'https://www.caspian-routes.com/en/blog/baku-winter',
  'https://www.caspian-routes.com/en/blog/gabala-winter',
  'https://www.caspian-routes.com/en/blog/gobustan-from-baku',
  'https://www.caspian-routes.com/en/blog/sheki-day-trip',
  'https://www.caspian-routes.com/en/blog/baku-hotels-sea-view',
  'https://www.caspian-routes.com/en/blog/baku-budget-from-russia',
  'https://www.caspian-routes.com/en/blog/baku-restaurants',
  'https://www.caspian-routes.com/en/blog/azerbaijan-7-days',
  'https://www.caspian-routes.com/en/blog/azerbaijan-beaches',
  'https://www.caspian-routes.com/en/blog/azerbaijan-visa',
  'https://www.caspian-routes.com/en/blog/azerbaijan-safety',
  'https://www.caspian-routes.com/en/blog/things-to-avoid-azerbaijan',
  'https://www.caspian-routes.com/en/blog/baku-tbilisi-route',
  'https://www.caspian-routes.com/en/blog/baku-hotels-couples',
  'https://www.caspian-routes.com/en/blog/lankaran',
  'https://www.caspian-routes.com/en/blog/azerbaijan-food',
  'https://www.caspian-routes.com/en/blog/azerbaijan-with-kids',
  'https://www.caspian-routes.com/tr/blog/azerbaycan-7-gun',
  'https://www.caspian-routes.com/tr/blog/azerbaycan-plajlari',
  'https://www.caspian-routes.com/tr/blog/azerbaycan-guvenli-mi',
  'https://www.caspian-routes.com/tr/blog/azerbaycan-vize',
  'https://www.caspian-routes.com/tr/blog/baku-1-gun',
  'https://www.caspian-routes.com/tr/blog/baku-3-gun',
  'https://www.caspian-routes.com/tr/blog/baku-istanbul-butce',
  'https://www.caspian-routes.com/tr/blog/baku-otelleri-ciftler',
  'https://www.caspian-routes.com/tr/blog/baku-deniz-manzarali-oteller',
  'https://www.caspian-routes.com/tr/blog/baku-restoranlar',
  'https://www.caspian-routes.com/tr/blog/baku-yaz',
  'https://www.caspian-routes.com/tr/blog/baku-tiflis-rota',
  'https://www.caspian-routes.com/tr/blog/baku-kis',
  'https://www.caspian-routes.com/tr/blog/gabala-kis',
  'https://www.caspian-routes.com/tr/blog/gobustan-baku',
  'https://www.caspian-routes.com/tr/blog/seki-gezi',
  'https://www.caspian-routes.com/tr/blog/azerbaycanda-yapilmamasi-gerekenler',
  'https://www.caspian-routes.com/tr/blog/lenkeran',
  'https://www.caspian-routes.com/tr/blog/azerbaycan-yemekleri',
  'https://www.caspian-routes.com/tr/blog/azerbaycan-cocuklarla',
];

async function indexUrls() {
  const authClient = await auth.getClient();
  let success = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      const res = await authClient.request({
        url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        method: 'POST',
        data: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`✅ ${url}`);
      success++;
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.log(`❌ ${url} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nГотово: ${success} успешно, ${failed} ошибок`);
}

indexUrls();