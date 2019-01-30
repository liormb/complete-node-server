export default function handleServerError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
}
