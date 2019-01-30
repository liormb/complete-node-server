import { body } from 'express-validator/check';
import User from '../models/User';

export const signupValidator = [
    body('firstName')
        .isLength({ min: 1 })
        .withMessage('First name is required')
        .trim(),
    body('lastName')
        .isLength({ min: 1 })
        .withMessage('Last name is required')
        .trim(),
    body('email')
        .isLength({ min: 1 })
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(value => User.findOne({ email: value })
            .then(userDocument => userDocument
                ? Promise.reject('Email already exist, please use a different email')
                : Promise.resolve()
            )
        ),
    body('password')
        .isLength({ min: 6 })
        .trim()
        .withMessage('Password is required'),
    body('confirm_password')
        .trim()
        .custom((value, {req}) => {
            if (value !== req.body.postNewPassword) {
                throw new Error('Passwords must match')
            }
            return true;
        }),
];

export const signinValidator = [
    body('email')
        .isLength({ min: 1 })
        .withMessage('Email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .trim()
        .withMessage('Password is required'),
];

export const productValidator = [
    body('title')
        .isAlphanumeric()
        .trim()
        .isLength({ min: 3 }),
    body('price')
        .isFloat(),
    body('imageUrl')
        .isURL(),
    body('description')
        .trim()
        .isLength({ min: 5, max: 500 }),
];
