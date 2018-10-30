const express = require('express');

const app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {
    
    var tipo = req.params.tipo;
    var img = req.params.img;
    
    var pathImagen = path.resolve( __dirname, `/uploads/${tipo}/${img}` );
    
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }else {
        var pathNoImage = path.resolve( __dirname, '/uploads/por-defecto/no-img.jpg' );
        res.sendFile(pathNoImage);
    }
    
});

module.exports = app;