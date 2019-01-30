export function get404(req, res) {
    res.status(404).render('layout', {
        route: '404',
        title: 'Page Not Found',
        isAuthenticated: req.session.isLoggedIn,
    });
}

export function get500(req, res) {
    res.status(500).render('layout', {
        route: '500',
        title: 'Server Error',
        isAuthenticated: req.session.isLoggedIn,
    });
}
