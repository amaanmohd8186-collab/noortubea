const https = require('https');

https.get('https://api.quran.com/api/v4/resources/asma_al_husna/1/audio', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});
