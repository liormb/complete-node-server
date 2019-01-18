import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import mailer, { sighUpEmail, resetPasswordEmail } from '../utils/mailer';

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
            return mailer.sendMail(sighUpEmail({
                email,
                firstName,
            }));
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

export function getResetPassword(req, res) {
    res.render('layout', {
        route: 'reset_password',
        title: 'Reset Password Page',
        errors: req.flash('resetPasswordErrors'),
    });
}

export function postResetPassword(req, res) {
    const { email } = req.body;

    crypto.randomBytes(32, (err, buffer) => {
        const token = buffer.toString('hex');

        User.findOne({ email })
            .then(user => {
                if (!user) {
                    req.flash('resetPasswordErrors', 'Can not find an account with this email');
                    return res.redirect('/reset-password');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // an hour
                return user.save();
            })
            .then(user => {
                res.redirect('/');
                return mailer.sendMail(resetPasswordEmail({
                    email,
                    token,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }));
            })
            .catch(console.log);
    });
}

export function getNewPassword(req, res) {
    const { token } = req.params;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then(user => {
            if (!user) {
                req.flash('resetPasswordErrors', 'Something went wrong, please try to reset your password again');
                return res.redirect('/reset-password');
            }
            res.render('layout', {
                route: 'new_password',
                title: 'New Password Page',
                userId: user._id.toString(),
                resetToken: token,
                errors: req.flash('newPasswordErrors'),
            });
        })
        .catch(console.log);
}

export function postNewPassword(req, res) {
    const { password, confirmPassword, userId, resetToken } = req.body;

    User.findOne({
        _id: userId,
        resetToken,
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then(user => {
            if (!user) {
                req.flash('resetPasswordErrors', 'Something went wrong, please try to reset your password again');
                return res.redirect('/reset-password');
            }
            return Promise.all([user, bcrypt.hash(password, 12)]);
        })
        .then(([user, hashedPassword]) => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save();
        })
        .then(() => res.redirect('/login'))
        .catch(console.log);
}
