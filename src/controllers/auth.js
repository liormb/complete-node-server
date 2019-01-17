import User from "../models/User";

export function getLogin(req, res) {
    res.render('layout', {
        route: 'login',
        title: 'Login Page',
        isAuthenticated: req.session.isLoggedIn,
    });
};

export function postLogin(req, res) {
    User.findById('5c3d321ae453bed97a31e9bc')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return new Promise((resolve, reject) =>
                req.session.save(err => err
                    ? reject()
                    : resolve()
                )
            );
        })
        .then(() => res.redirect('/'))
        .catch(console.log);
};

export function postLogout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
}
