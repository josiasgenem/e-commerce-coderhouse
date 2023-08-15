export const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/users/login');
    return next();
}

export const isNotAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) return res.redirect('/users/profile');
    return next();
}

export const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') return next();
    res.json({
        status: 'error',
        error: 'Forbidden! Only Admin members!'
    });
}