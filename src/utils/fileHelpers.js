import fs from 'fs';
import multer from 'multer';
import handleServerError from '../middlewares/handleServerError';

const IMAGE_PATH = 'data/images';
const IMAGE_EXTENTIONS = ['image/png', 'image/jpg', 'image/jpeg'];

export function filename(req, file, callback) {
    return callback(null, `${Date.now()}-${file.originalname}`);
}

export function destination(req, file, callback) {
    return callback(null, IMAGE_PATH);
}

export function fileFilter(req, file, callback) {
    const isValid = IMAGE_EXTENTIONS.includes(file.mimetype);
    return callback(null, isValid);
}

export const fileStorage = multer.diskStorage({
    filename,
    destination,
});

export function deleteFile(next, filePath) {
    fs.unlink(filePath, err => {
        if (err) {
            handleServerError(next, err);
        }
    });
}
