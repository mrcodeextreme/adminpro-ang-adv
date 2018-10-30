require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use( require ('./routes/index'));


mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
 if (err) throw err;

 console.log('BDD Conectada exitosamente!!!');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});