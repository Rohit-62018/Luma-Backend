class ExpressError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const ErrorHandler = (err, req, res, next) => {
    console.error(err.message);

    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    res.status(status).json({
        success: false,
        message
    });
}
module.exports = { ExpressError, ErrorHandler};