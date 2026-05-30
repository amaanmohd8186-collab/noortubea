const https = require('https');

https.get('https://www.islamcan.com/audio/adhan/azan1.mp3', (res) => {
  console.log(res.statusCode, res.headers['content-type']);
});
