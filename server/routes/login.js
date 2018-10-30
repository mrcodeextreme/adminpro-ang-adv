const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioBDD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        
        if ( !usuarioBDD ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o Contrasena invalidos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBDD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o Contrasena invalidos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioBDD
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioBDD,
            id: usuarioBDD._id,
            token

        });
        
    });

    /* res.json({
        ok: true
    }); */

});


module.exports = app;