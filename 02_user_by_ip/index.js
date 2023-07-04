const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

const ipData = [];

fs.createReadStream('ip_data.csv')
    .pipe(csv())
    .on('data', (row) => {
        ipData.push(row);
    })
    .on('end', () => {
        console.log('IP data loaded');
    });

app.get('/location', (req, res) => {
    const userIp = req.headers.ip; 
    const ip = checkIp(userIp);
    if (ip) {
        const country = ip.country;
        res.send(`User IP: ${userIp}, Country: ${country}`);
    } else {
        res.send(`User IP: ${userIp}, Country: Not found`);
    }
});

function checkIp(ip) {
    const ipNumber = ipToNumber(ip);
    try {
        return ipData.find(value => ipNumber > value.from && ipNumber < value.to)
    } catch (e) {
        return undefined
    }
}

function ipToNumber(ip) {
    const octet = ip.split('.');

    return (parseInt(octet[0]) * 256 * 256 * 256) +
        (parseInt(octet[1]) * 256 * 256) +
        (parseInt(octet[2]) * 256) +
        parseInt(octet[3]);
}

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
