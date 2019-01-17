export function get404(req, res) {
    res.status(404).render('layout', {
        route: '404',
        title: 'Page Not Found',
        isAuthenticated: req.isLoggedIn,
    });
}
