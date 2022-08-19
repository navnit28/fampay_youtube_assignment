const mongoose = require('mongoose')
// const Redis = require('ioredis')
// const Queue = require('bull');
// const Infura = require('@provider/infura')
// const Etherscan = require('@provider/etherscan')
// const Alchemy = require('@provider/alchemy')
// const Discord = require('@provider/discord')
// const MeetsMetaBuffProvider = require('@provider/meetsmeta-buff');

// const redis_bus = new Redis(process.env.REDIS_URI)
// const PlayerSyncQueue = new Queue('PlayerSyncQueue', process.env.REDIS_URI)

const videoBody = {
    title: {
        type: String,
        index: true,
        required: false,
        // create text index
    },
    description: {
        type: String,
        index: true,
        required: false,
    },
    published_at: {
        type: Date,
        required: false,
        index: true
    },
    thumbnail: {
        type: Object,
        required: false
    },
    channel_title: {
        type: String,
        required: false
    },
    video_id: {
        type: String,
        required: false,
    }
}

const videoSchema = mongoose.Schema(videoBody, {
    timestamps: true
})

// create text index for title and description
videoSchema.index({
    title: 'text',
    description: 'text'
})
videoSchema.pre('save', async function (next) {

    next()
})

videoSchema.post('save', async function () {
    // try {
    //     await this.cacheUserInfo()
    // } catch (err) {
    //     console.log(err.message)
    // }
})

// userSchema.post('remove', async function () {
//     try {
//         await this.deleteInIndex(userES)

//     } catch (err) {
//         console.log(err);
//     }

//})

// const params = {
//     redis_bus,
//     etherscan_provider: new Etherscan(),
//     infura_provider: new Infura(),
//     discord_provider: new Discord(),
//     alchemy_provider: new Alchemy(),
//     buff_provider: new MeetsMetaBuffProvider(),
//     queues: {
//         PlayerSyncQueue
//     }
// }
// require("@model_method/userSchemaMethods/helper_methods")(userSchema, params);
// require("@model_method/userSchemaMethods/scholarship_methods")(userSchema, params);
// require("@model_method/userSchemaMethods/bookmark_methods")(userSchema, params);
// require("@model_static/userSchemaStatics")(userSchema, params);

const Video = mongoose.model('videos', videoSchema)
module.exports = Video