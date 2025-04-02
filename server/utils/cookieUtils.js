export function setCookie(res, token) {
    return res.status(200)
        .cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 // 1 hora
        })
}

export function buscarCookie(req, name){
    if(req.cookies[name] && req.cookies){
        return req.cookies[name];
    }
}

export function borrarCookie(res, name){
    return res.clearCookie(name).sendStatus(200);
}