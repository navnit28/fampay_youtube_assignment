// const EntityDefinition = require('@model/entityDefinitionSchema');
// const path = require('path');
// const readJson = require('readjson');
// const Redis = require('ioredis');

// const redis_bus = new Redis(process.env.REDIS_URI);

// async function findOrCreate(group_id, entity_id, definition) {
//     let cd = await EntityDefinition.findOne({
//         entity_id,
//     });
//     if (!cd) {
//         cd = new EntityDefinition({
//             entity_id,
//             group_id,
//             definition,
//         });
//         await cd.save();
//     }
// }

// async function createDefinitions() {
//     try {

//         // const sku_definitions = ['50_mints', '101_mints', '301_mints', '501_mints', '700_mints', '900_mints', '1100_mints', '1600_mints', '2100_mints'];
//         // await findOrCreate('sku_packages', 'sku_packages', sku_definitions);
//         const error_maps_path = path.join(__dirname, '..', '..', 'errors', 'operations', 'operation_errors.json');
//         const operation_errors = await readJson(error_maps_path);
//         await redis_bus.set('operation_errors_map_scholarship', JSON.stringify(operation_errors));
//         // await redis_bus.disconnect();
//     } catch (error) {
//         console.log(error);
//     }
// }

// createDefinitions();