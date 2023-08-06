export const isAuthenticated = (req, res, next) => {
    if (!req.session.user) res.redirect('/login');
    next();
}

export const isNotAuthenticated = (req, res, next) => {
    if(req.session.user) res.redirect('/profile');
    next();
}

export const isAdmin = (req, res, next) => {
    if (req.session.user.role !== 'admin') res.json({
        status: 'error',
        error: 'Forbidden! Only Admin members!'
    });
    next();
}