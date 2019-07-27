exports.asyncHandler = fn => (req, res, next) => fn(req, res, next).catch(next);

exports.asyncErrorHandler = fn => (err, req, res, next) => fn(err, req, res, next).catch(next);

exports.globalErrorHandler = () => exports.asyncErrorHandler(async (err, req, res) => {
    console.error(err);
    try {
        res.status(parseInt(err.code, 10) || 500);
        res.json({
            error: err.message || err,
        });
    } catch (e) {
        console.error(`Exception sending error: ${e}`);
    }
});
