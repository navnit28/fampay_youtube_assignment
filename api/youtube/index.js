const withPagination = require('@middleware/withPagination');
// const withFullUser = require('@middleware/withFullUser');
const YoutubeController = require('@controller/client/youtube');
module.exports = function (router) {
    router.get('/videos',[withPagination],YoutubeController.getSearchResults);
}