const https = require('https');

https.get('https://api.quran.com/api/v4/resources/tafsirs', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const json = JSON.parse(data);
    const langs = new Set(json.tafsirs.map(t => t.language_name));
    console.log(Array.from(langs));
  });
});
