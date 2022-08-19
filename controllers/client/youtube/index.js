const YouTubeProvider=require('@provider/youtube_provider');
const asyncHandler = require('express-async-handler');
const youtubeProvider=new YouTubeProvider();
const youtubeSchema=require('@model/videoSchema');
const aqp = require('api-query-params');
const entityDefinitionSchema=require('@model/entityDefinitionSchema');
const Redis = require('ioredis');
const redis_bus = new Redis({
  host: 'redis',
  port: 6379,
  password: '',
  db: 0,
});
// const redis_bus = new Redis()
const invokeOperationError = require('@errors/invokeOperationError');
const api_key_limit= 3;
const getSearchResults = asyncHandler(async (req, res) => {
    const custom_query = req.query;
    custom_query.sort = '-published_at';
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
    if(!entity_obj) return;
    const api_key_array=entity_obj.definition;
    //find the api key whoose count is less than the api_key_limit and increase the count by 1 and save the record
    let payload,count;
    for(let i=0; i<api_key_array.length; i++){
        const api_key=api_key_array[i];
        const key_count=await redis_bus.get(`api_key_count_${api_key}`);
        if(key_count<api_key_limit){
            count = await redis_bus.incr(`api_key_count_${api_key}`);
            payload=api_key;
            break;
        }
    }
    // console.log(payload);
    // const count=await redis_bus.incr(`api_key_count_${payload}`);
    console.log(payload," has frequecy ",count);
    if(!payload){
        console.log('no api key available');
        return;
    }
    // await redis_bus.incr(`api_key_count_${payload}`);
    // console.log("this api key",payload," has ",redis_bus.get(`api_key_count_${payload}`));
    const resp= await youtubeProvider.getSearchResults(payload);

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
        console.log("saved video");
    }
})
const deleteSearchResults = asyncHandler( async()=> {
    await youtubeSchema.deleteMany({});
    console.log("deleted all videos");
} )
const searchVideos = asyncHandler( async(req, res) => {
    try{
        const custom_query = req.query;
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
    }
    catch(error){
        console.log(error);
        invokeOperationError("errors.videos.failed.search")
    }
})
module.exports={
    getSearchResults,
    postSearchResults,
    deleteSearchResults,
    searchVideos
}