import get from 'lodash.get';
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
        .isLength({ min: 2, max: 510 })
        .trim(),
    body('price')
        .isFloat()
        .trim(),
    body('image')
        .custom((value, {req}) => {
            const isEditProduct = !!get(req.params, 'productId');
            return isEditProduct || !!req.file;
        })
        .withMessage('Attached file is not a valid image'),
    body('description')
        .isLength({ min: 2, max: 510 })
        .trim(),
];
