const { encrypt } = require('../utils/encryption');

function encryptResponse(req, res, next) {
    const originalSend = res.send;

    res.send = function (body) {
        try {
            const responseBody = JSON.parse(body);

            //TODO : SHOW RESPONSE IN CONSOLE
            // console.log('responseBody', responseBody) 

            let token;

            // Check if the response contains a token
            if (responseBody?.data?.token) {
                token = responseBody?.data?.token;
                delete responseBody?.data?.token;
            }

            // Encrypt the rest of the response
            const encrypted = encrypt(JSON.stringify(responseBody));
            const finalResponse = { data: encrypted };

            // Reattach the token if it exists
            if (token) {
                finalResponse.token = token;
            }

            originalSend.call(this, JSON.stringify(finalResponse));
        } catch (error) {
            // If parsing fails, assume it's not a JSON body and proceed with encryption
            const encrypted = encrypt(body);
            originalSend.call(this, JSON.stringify({ data: encrypted }));
        }
    };

    next();
}

module.exports = { encryptResponse };
