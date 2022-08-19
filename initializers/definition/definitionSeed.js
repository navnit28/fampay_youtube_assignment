const EntityDefinition = require('@model/entityDefinitionSchema');
const path = require('path');
const readJson = require('readjson');
const Redis = require('ioredis');
const redis_bus = new Redis({
  host: 'redis',
  port: 6379,
  password: '',
  db: 0,
});
// const redis_bus = new Redis();
async function findOrCreate(group_id, entity_id, definition) {
    let cd = await EntityDefinition.findOne({
        entity_id,
    });
    if (!cd) {
        console.log("new entity db created")
        cd = new EntityDefinition({
            entity_id,
            group_id,
            definition,
        });
        await cd.save();
    }
}

async function createDefinitions() {
    try {

        const api_key_intializer = ["AIzaSyDlzG_HVTm7l6nuFm0BWWez2JrehRmbzLA","AIzaSyANpIHL293RawlG2a7FvCoob1hoLz_Ao4I","AIzaSyBK8CdwuU1vF7RCZ7DbJbzhUKmcfIA_AeI"];
        for(let i=0;i<api_key_intializer.length;i++){
            await redis_bus.set(`api_key_count_${api_key_intializer[i]}`,0);
        }
        await findOrCreate('api_key', 'api_key', api_key_intializer);
        const error_maps_path = path.join(__dirname, '..', '..', 'errors', 'operations', 'operation_errors.json');
        const operation_errors = await readJson(error_maps_path);
        await redis_bus.set('operation_errors_map_scholarship', JSON.stringify(operation_errors));
        await redis_bus.disconnect();
    } catch (error) {
        console.log(error);
    }
}

createDefinitions();