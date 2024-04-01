function userExistsResponse(req,res) {
    return res.status(400).json({
        success: false,
        message: 'Usuario ya existe'
    })
}

function userSignedUpResponse(req,res) {
    return res.status(201).json({
        success: true,
        message: 'Usuario creado con éxito'
    })
}

function userSignedOutResponse(req,res) {
    return res.status(201).json({
        success: true,
        message: 'Usuario deslogueado'
    })
}

function userNotFoundResponse(req,res) {
    return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
    })
}

function mustSignInResponse(req,res) {
    return res.status(400).json({
        success: false,
        message: 'Inicia sesión para continuar'
    })
}

function invalidCredentialsResponse(req,res) {
    return res.status(401).json({
        success: false,
        message: 'Email o contraseña incorrectos'
    })
}

function verifyResponse(req,res) {
    return res.status(401).json({
        success: false,
        message: 'Por favor verifica tu cuenta'
    })
}

module.exports = {
    userSignedUpResponse,
    userExistsResponse,
    userNotFoundResponse,
    userSignedOutResponse,
    mustSignInResponse,
    invalidCredentialsResponse,
    verifyResponse
}