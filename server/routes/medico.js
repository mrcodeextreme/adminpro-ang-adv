var express = require('express');
var jwt = require('jsonwebtoken');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

var app = express();

const Medico = require('../models/medico');

// ==========================================
// Obtener todos los hospitales
// ==========================================

app.get('/medico', (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img')
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicoObtenidos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medico',
                errors: err
            });
        }

        Medico.count({}, (err, conteoMedicos) => {

            res.status(200).json({
                ok: true,
                medicos: medicoObtenidos,
                total: conteoMedicos
            });
        });

    });

});


// ==========================================
// Actualizar medico
// ==========================================
app.put('/medico/:id', verificaToken, (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['nombre img hospital']);

    Medico.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, medicoActualizar) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medicoActualizar) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medicoActualizar.usuario = req.usuario._id;
        medicoActualizar.hospital = req.hospital;

        medicoActualizar.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

// ==========================================
// Crear nuevo medico
// ==========================================

app.post('/medico', verificaToken, (req, res) => {


    const body = req.body

    const medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

    if (err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al crear medico',
            errors: err
        });
    }

    res.status(200).json({
        ok: true,
        medico: medicoGuardado
        });

    });

});


module.exports = app;