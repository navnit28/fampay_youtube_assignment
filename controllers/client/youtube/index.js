const YouTubeProvider=require('@provider/youtube_provider');
const asyncHandler = require('express-async-handler');
const youtubeProvider=new YouTubeProvider();
const youtubeSchema=require('@model/videoSchema');
const aqp = require('api-query-params');
const getSearchResults = asyncHandler(async (req, res) => {
    const custom_query = req.query;
    //sort in descending order of published_at key
    custom_query.sort = '-published_at';
    // custom_query.thread_id=req.query.thread_id;
    const {filter,skip,limit,sort}=aqp({
        skip: req.page * req.perPage,
        ...custom_query,
      });
    const videos=await youtubeSchema.find(filter).sort(sort).skip(skip).limit(limit).exec();
    res.json({
        "data":videos
    })
})
const postSearchResults = asyncHandler( async()=> {
    const resp= await youtubeProvider.getSearchResults();
    // console.log("got items here",resp.items);
    // save to db
    const videos=resp.items;
    for(let i=0;i<videos.length;i++){
        const video=videos[i];
        //save to db
        const video_obj=new youtubeSchema({
            title:video.snippet.title,
            description:video.snippet.description,
            thumbnail:video.snippet.thumbnails,
            published_at:video.snippet.publishedAt,
            channel_title:video.snippet.channelTitle,
            video_id:video.id.videoId
        });
        await video_obj.save();
        console.log("saved video",video_obj);
    }
})
const deleteSearchResults = asyncHandler( async()=> {
    //delete the entire collection
    await youtubeSchema.deleteMany({});
    console.log("deleted all videos");
} )
const searchVideos = asyncHandler( async(req, res) => {
})
module.exports={
    getSearchResults,
    postSearchResults,
    deleteSearchResults
}