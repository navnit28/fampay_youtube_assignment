const mongoose = require('mongoose')

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


const Video = mongoose.model('videos', videoSchema)
module.exports = Video