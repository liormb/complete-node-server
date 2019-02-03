export default function handleServerError(next, err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(err);
    return next(error);
}
