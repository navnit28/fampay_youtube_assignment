const YouTubeProvider=require('@provider/youtube_provider');
const asyncHandler = require('express-async-handler');
const youtubeProvider=new YouTubeProvider();
const youtubeSchema=require('@model/videoSchema');
const aqp = require('api-query-params');
const entityDefinitionSchema=require('@model/entityDefinitionSchema');
const api_key_limit= process.env.API_KEY_LIMIT || 5
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
    const entity_obj=await entityDefinitionSchema.findOne({entity_id:'api_key'});
    const api_key_array=entity_obj.definition;
    //find the api key whoose count is less than the api_key_limit and increase the count by 1 and save the record
    const payload=api_key_array.find(key=>key.count<api_key_limit);
    if(!payload){
        console.log('no api key available');
        return;
    }
    payload.count++;
    entity_obj.markModified('definition');
    await entity_obj.save();
    // const payload=api_key_array.find(key=>key.count<api_key_limit);
    console.log(payload.api_key)
    const resp= await youtubeProvider.getSearchResults(payload.api_key);

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
    const custom_query = req.query;
    custom_query.sort = '-published_at';
    const {filter,skip,limit,sort}=aqp({
        skip: req.page * req.perPage,
        ...custom_query,
      });
      console.log("filter",filter);
    const videos=await youtubeSchema.find({
        $text: { $search: req.query.q }},
        {score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).skip(skip).limit(limit).exec();
    res.json({
        "data":videos
    })
})
module.exports={
    getSearchResults,
    postSearchResults,
    deleteSearchResults,
    searchVideos
}