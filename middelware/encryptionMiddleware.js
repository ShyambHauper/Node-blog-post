// middlewares/encryptionMiddleware.js
const { encrypt } = require('../utils/encryption');

function encryptResponse(req, res, next) {
    const originalSend = res.send;

    res.send = function (body) {
        try {
            const responseBody = JSON.parse(body);
            // console.log('responseBody', responseBody)
            if (responseBody.token) {
                // If there is a token in the response, do not encrypt
                originalSend.call(this, body);
            } else {
                // Otherwise, encrypt the response
                const encrypted = encrypt(body);
                originalSend.call(this, JSON.stringify(encrypted));
            }
        } catch (error) {
            // If parsing fails, assume it's not a JSON body and proceed with encryption
            const encrypted = encrypt(body);
            originalSend.call(this, JSON.stringify(encrypted));
        }
    };

    next();
}

module.exports = { encryptResponse };
