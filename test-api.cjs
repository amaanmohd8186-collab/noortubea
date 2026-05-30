const https = require('https');

https.get('https://api.aladhan.com/v1/asmaAlHusna', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(JSON.parse(data).data[0]);
  });
});
