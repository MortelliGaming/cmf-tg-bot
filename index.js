
const { setupTGBot } = require('./serverside/telegrambot')

require('dotenv').config()
const express = require("express");
const path = __dirname + '/dist/';
const app = express();
const secure_app = express();

app.use(express.static(path));
app.get('*', function (req,res) {
    res.sendFile(path + "index.html");
});

secure_app.get('*', function (req,res) {
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




