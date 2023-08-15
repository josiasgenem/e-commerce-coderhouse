export const register = async (req, res) => {
    res.render('register'); 
}

export const login = async (req, res) => {
    res.render('login'); 
}

export const profile = async (req, res) => {
    res.render('profile', { user: req.user })
}