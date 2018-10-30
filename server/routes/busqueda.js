const express = require('express');


const app = express();

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

app.get('/busqueda/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var rex = new RegExp(busqueda, 'i');

    Promise.all( [
            buscarHospitales(busqueda, rex),
            buscarMedicos(busqueda, rex),
            buscarUsuarios(busqueda, rex) 
        ] )
        .then(respuestas => {
            
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            }); 
        });
});

function buscarHospitales(busqueda, rex) {
    
    return new Promise( (resolve, reject) => {

        Hospital.find({nombre: rex})
                .populate('usuario', 'nombre email')
                .exec((err, hospitales) => {

            if  (err) {
                reject('Error al cargar hospitales');
            }else {
                resolve(hospitales);
            }
    
        });

    });

    
}

function buscarMedicos(busqueda, rex) {
    
    return new Promise( (resolve, reject) => {

        Medico.find({nombre: rex}, (err, medicos) => {

            if  (err) {
                reject('Error al cargar medicos');
            }else {
                resolve(medicos);
            }
    
        });

    });

    
}

function buscarUsuarios(busqueda, rex) {
    
    return new Promise( (resolve, reject) => {

        Usuario.find({}, 'nombre email')
               .or([ {'nombre': rex}, {'email': rex} ])
               .exec( (err, usuarios) =>{
                    if (err) {
                        reject('Error a cargar usuarios');
                    } else {
                        resolve(usuarios);
                    }
               });   

    });

    
}


app.get('/busqueda/coleccion/:tabla/:busqueda', (req, res) => {
    
    var busqueda = req.params.busqueda;
    var rex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;

    switch (tabla) {
        case 'medico':
            Medico.find({nombre: rex}, (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    medicos: medicos
                });
        });            
        break;
    
        case 'hospital':
            Hospital.find({nombre: rex}, (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales
                });
        });            
            break;    
    }

});

/* app.get('/busqueda/todo/:busqueda', async(req, res, next) => {


    var busqueda = req.params.busqueda;
    

    var rex = new RegExp(busqueda, 'i');

    try {
    
        let buscaHosp = await Hospital.find({nombre: rex}, (err, hospitales) => {


            return res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
    
    });

    if (!buscaHosp) {
        
        next();
      }else{

      let buscarMed = await Medico.find({nombre: rex}, (err, medicos) => {
        return res.status(200).json({
            ok: true,
            medicos: medicos
        });

      });
    }
        
    } catch (error) {
        next(error);
    }

    
}); */


module.exports = app;