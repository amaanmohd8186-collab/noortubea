const https = require('https');

https.get('https://api.quran.com/api/v4/resources/tafsirs', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const json = JSON.parse(data);
    const hindi = json.tafsirs.filter(t => t.language_name === 'hindi');
    console.log(hindi);
  });
});
