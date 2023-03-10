exports.authCheck = (req, res, next) => {
    // req.header.auth
    // const user = lookup session table (token)
    // if (!user) res.send(401, 'Forbidden');l
    


    if (req.auth_token && isAuthenticated(req.auth_token))
        next();
    else
        res.status(401).end();
}