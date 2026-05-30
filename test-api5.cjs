const https = require('https');

https.get('https://api.aladhan.com/v1/gToHCalendar/3/2026', (res) => {
  console.log(res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 100));
  });
});
