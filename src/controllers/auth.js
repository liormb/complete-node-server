import bcrypt from 'bcryptjs';
import User from '../models/User';
import mailer, { sighUpMail } from '../utils/mailer';

export function getSignup(req, res) {
    res.render('layout', {
        route: 'signup',
        title: 'SignUp Page',
        errors: req.flash('signupErrors'),
    });
}

export function postSignup(req, res) {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    const signupPromise = path => bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                cart: { items: [] },
            });
            return user.save();
        })
        .then(() => path);

    User.findOne({ email })
        .then(userDocument => {
            if (userDocument) {
                req.flash('signupErrors', 'Email already exist, please use a different email');
                return Promise.resolve('/signup');
            }
            return signupPromise('/login');
        })
        .then(path => {
            res.redirect(path);
            return mailer.sendMail(sighUpMail({ email, firstName }));
        })
        .catch(console.log);
}

export function getLogin(req, res) {
    res.render('layout', {
        route: 'login',
        title: 'Login Page',
        errors: req.flash('loginErrors'),
    });
};

export function postLogin(req, res) {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('loginErrors', 'Invalid email or password');
                return Promise.resolve('/login');
            }
            return bcrypt.compare(password, user.password)
                .then(hasMatched => {
                    if (!hasMatched) {
                        req.flash('loginErrors', 'Invalid email or password');
                        return Promise.resolve('/login');
                    }
                    req.session.user = user;
                    req.session.isLoggedIn = true;

                    return new Promise((resolve, reject) =>
                        req.session.save(err => err
                            ? reject()
                            : resolve('/')
                        )
                    );
                })
                .catch(() => Promise.resolve('/login'));
        })
        .then(path => res.redirect(path))
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
