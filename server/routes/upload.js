const express = require('express');
const fu = require('express-fileupload');

/* const multer = require('multer');
public: tipon = '';
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `/uploads/`);
    },
    filename: function(req, file, cb) {
       // const partes = file.originalname.split('.');
       // const type = partes[partes.length - 1];
        cb(null, file.originalname);
    }
}); */

// const upload = multer({storage: storage});
const fs = require('fs');

const app = express();

const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');


app.use(fu());

app.put('/upload/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['hospital', 'medico', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ extensionArchivo }`; 


    // Mover el archivo del temporal a un path
     var path = `/uploads/${ tipo }/${ nombreArchivo }`;

  

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        /*  res.status(200).json({
             ok: true,
             mensaje: 'Archivo movido',
             extensionArchivo: extensionArchivo
         });
  */  


});

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo == 'usuario') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'NO existe'
                    
                });
            }

            var oldPath = '/uploads/usuario/' + usuario.img;

            // Si existe, elimina imagen anterior
            if (fs.existsSync(oldPath)) {
                fs.unlink ( oldPath );
            }
                usuario.img = nombreArchivo;

                usuario.save( (err, usuarioActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    });
                });
        });
    }

    if (tipo == 'medico') {
        
            Medico.findById(id, (err, medico) => {
    
                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'NO existe'
                        
                    });
                }

                var oldPath = '/uploads/medico/' + medico.img;
    
                // Si existe, elimina imagen anterior
                if (fs.existsSync(oldPath)) {
                    fs.unlink ( oldPath );
                }
                    medico.img = nombreArchivo;
    
                    medico.save( (err, medicoActualizado) => {
                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Imagen de medico actualizada',
                            usuario: medicoActualizado
                        });
                    });
    
            });
    }
    
    if (tipo == 'hospital') {
        Hospital.findById(id, (err, hospital) => {
    
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'NO existe'
                    
                });
            }

            var oldPath = '/uploads/hospital/' + hospital.img;

            // Si existe, elimina imagen anterior
            if (fs.existsSync(oldPath)) {
                fs.unlink ( oldPath );
            }
                hospital.img = nombreArchivo;

                hospital.save( (err, hospitalActualizado) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada',
                        usuario: hospitalActualizado
                    });
                });


        });
    }

}

module.exports = app;

/*console.log(req.file);

    var tipo = req.params.tipo;
   // var id = req.params.id;
    setTipo(tipo);
    console.log(getTipo());
    // tipos de colección
    var tiposValidos = ['hospital', 'medico', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.file.originalname;
    var nombreCortado = archivo.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    res.status(200).json({
        ok: true,
        mensaje: 'Archivo movido',
        extensionArchivo: extensionArchivo
    }); */