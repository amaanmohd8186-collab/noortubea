const https = require('https');

https.get('https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3', (res) => {
  console.log(res.statusCode, res.headers['content-type']);
});
