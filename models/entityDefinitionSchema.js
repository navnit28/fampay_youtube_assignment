const mongoose = require( 'mongoose' )

const entityDefinitionBody = {
    entity_id: {
        type: String,
        required: true,
        index: true
    },
    group_id: {
        type: String,
        required: false,
        index: true
    },
    definition: {
        type: Object,
        required: true
    },
    regenerate: {
        type: Boolean,
        default: true
    },
}

const entityDefinitonSchema = mongoose.Schema( entityDefinitionBody, { timestamps: true } )

entityDefinitonSchema.pre( 'save', async function ( next )
{


    next()
} )


const EntityDefinition = mongoose.model( 'EntityDefinition', entityDefinitonSchema )
module.exports = EntityDefinition