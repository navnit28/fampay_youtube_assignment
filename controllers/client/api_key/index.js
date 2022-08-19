const entityDefinitionSchema=require('@model/entityDefinitionSchema');
const postApiKey = async (req, res) => {
    try
    {
        const entity_obj=await entityDefinitionSchema.findOne({entity_id:'api_key'});
        const api_key_array=entity_obj.definition;
        const api_key_obj={
            api_key:req.body.api_key,
            count:0
        }
        api_key_array.push(api_key_obj);
        entity_obj.markModified('definition');
        await entity_obj.save();
        res.json({

            "msg":"api key saved"
        })
    }
    catch(err){
        res.status(400).json({
            "msg":"some error occured",
            "error":err
        })
    }
}
module.exports={
    postApiKey
}