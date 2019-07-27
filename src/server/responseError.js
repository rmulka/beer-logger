class ResponseError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
        this.name = 'ResponseError';
    }
}

module.exports = ResponseError;