const express = require('express');
const fs = require('fs');

let app = express();

module.exports = { app };

let port = 4000;

let server = process.env.port ? process.server : app.listen({
    host: process.env.host ? process.env.host : 'localhost',
    port
}, () => console.log(`listening to port ${port}`));

/**
 * Sends all resources in one request
 */
app.get('/resources', (req, res, next) => {
    let files = fs.readdirSync(__dirname + '/public/res');
    console.log("files");
    res.send(JSON.stringify(files));
})

// normal static route for rest
app.use(express.static(__dirname + '/public'));

module.exports = { app };