
const cron = require('node-cron');
const axios = require('axios');
const { setupTGBot } = require('./serverside/telegrambot')

require('dotenv').config()
const express = require("express");
const path = __dirname + '/dist/';
const app = express();
const secure_app = express();


/*
// keep alive
cron.schedule('* * * * *', function() {
    // console.log('running a task every minute');
    const HEROKU_URL = (process.env.HEROKU_PING_URL || 'https://cmf-ticker-bot.herokuapp.com/')
    axios.get(HEROKU_URL)
    .then(function (response) {
        // handle success
        console.log('the server is up')
        // console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log('server not found: ', HEROKU_URL);
    })
    .then(function () {
        // always executed
    });
});
// 
*/ 

app.use(express.static(path));
app.get('*', function (req,res) {
    res.sendFile(path + "index.html");
});

secure_app.get('/', function (req,res) {
    res.status(200).send('OK');
});

const PORT = (process.env.PORT || 8081);
secure_app.listen(PORT, () => {
  console.log(`Secure Server is running on port ${PORT}.`);
});
const VUE_PORT = (process.env.VUE_SERVER_PORT || 8080)
app.listen(VUE_PORT, () => {
    console.log(`Local Server is running on port `, VUE_PORT);
});

setupTGBot();




