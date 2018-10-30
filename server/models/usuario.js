const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email necesario']
    },
    password: {
        type: String,
        required: [true, 'Password Requerida!']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    google: {
        type: Boolean,
        default: false
    }

});


usuarioSchema.plugin(unique, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);