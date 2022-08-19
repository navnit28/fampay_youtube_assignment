const entityDefinitionSchema=require('@model/entityDefinitionSchema');
const invokeOperationError = require('@errors/invokeOperationError');
const postApiKey = async (req, res) => {
    try
    {
        const entity_obj=await entityDefinitionSchema.findOne({entity_id:'api_key'});
        const api_key_array=entity_obj.definition;
        api_key_array.push(req.body.api_key);
        entity_obj.markModified('definition');
        await entity_obj.save();
        res.json({
            "msg":"api key saved"
        })
    }
    catch(err){
        console.log(err);
        invokeOperationError('errors.api_key.failed.save')
    }
}
module.exports={
    postApiKey
}