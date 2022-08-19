const ApiKeyConttroller = require('@controller/client/api_key');
module.exports = function (router) {
    router.post('/', ApiKeyConttroller.postApiKey);
}