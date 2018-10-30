
const jwt = require('jsonwebtoken');

// ============
// Verifica Token
//=============

let verificaToken = (req, res, next) => {


    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
             return res.status(401).json({
                ok: false,
                err: err
             });   
        }

        req.usuario = decoded.usuario;
        next();
    });

    
};


// =================================
// Verifica ADMIN_ROLE - POST
//==================================

let onlyAdminCanCrudUsers = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    }

else {
    return res.status(500).json({
        ok: false,
        err: {
            message: 'Usuario no es administrador'
        }
        
        });
    }
};


module.exports = {
    verificaToken,
    onlyAdminCanCrudUsers
}