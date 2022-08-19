/* eslint-disable no-underscore-dangle */
// const _ = require('lodash');
const asyncHandler = require('express-async-handler');
const _ = require('lodash');
const invokeOperationError = require('@errors/invokeOperationError');
const Scholarship = require('@model/scholarshipSchema.js');
const User = require('@model/userSchema.js');
const aqp = require('api-query-params');

const updateScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findOne({
    _id: req.params.id
  })
  if (!scholarship) invokeOperationError('errors.entity.notfound');
  const keys = Object.keys(req.body);
  for (const key of keys) {
    if (req.body[key] != null) {
      scholarship[key] = req.body[key];
    }
  }
  await scholarship.save();
  res.json(scholarship);
})


const getUserScholarshipsById = asyncHandler(async (req, res) => {
  const {
    user_id,
  } = req.params;
  const {
    query
  } = req;


  const {
    filter,
    skip,
    limit,
    sort,
    projection,
    population,
  } = aqp({
    skip: req.page * req.perPage,
    ...query,
  });
  console.log("GET scholarships query Admin: ", query, skip)

  const participant_match = {
    participants: {
      '$in': [user_id]
    }
  }
  const new_filter = Object.assign(filter || {}, participant_match)
  console.log('Scholar By ID Query: ', new_filter)
  const offers = await Scholarship
    .find(new_filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate(population)
    .exec();

  res.json(offers);
});


const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    address: req.params.id
  })
  if (!user) invokeOperationError('errors.entity.notfound');
  const keys = Object.keys(req.body);
  for (const key of keys) {
    if (req.body[key] != null) {
      user[key] = req.body[key];
    }
  }
  await user.save();
  res.json(user);
})

const syncAllPlayersBuff = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: 'PLAYER'
  })
  console.log(users.length);
  for (let u of users) {
    await u.changeRole('PLAYER');
  }
  res.json(users);
})


const recheckPendingStakes = asyncHandler(async (req, res) => {
  const {
    status,
    type
  } = req.body;
  const pendings = await Scholarship.find({
    eth_staking_transaction_hash: {
      "$exists": true
    },
    status: {
      "$in": status
    }
  })
  const {
    ETH_NETWORK
  } = process.env;
  pendings.forEach(async (scholarship) => {
    const {
      holder_id,
      _id,
      player_id,
      percentage_offering,
      eth_staking_transaction_hash,
      eth_unstaking_transaction_hash,
      metadata,
      scholarship_period,
    } = scholarship;


    const holder_meta = await User.getUserFromCache(holder_id);
    const player_meta = await User.getUserFromCache(player_id);
    await req.modules.queues.StakingVerificationQueue.add({
      type,
      payload: {
        eth_staking_transaction_hash,
        eth_unstaking_transaction_hash,
        holder_id,
        percentage_offering,
        scholarship_period,
        scholarship_id: _id,
        player_id,
        metadata: {
          scholarship: metadata,
          player: {
            discord: player_meta.discord
          },
          holder: {
            discord: holder_meta.discord
          }
        },
        eth_network: ETH_NETWORK
      }
    })
  })
  res.json(pendings);
})


const grantToken = asyncHandler(async (req, res) => {
  const {
    key,
    user_id
  } = req.body;
  if (key !== 'SHA256-512@@$$') invokeOperationError('errors.entity.notfound');
  const user = await User.findOne({
    user_id,
  })
  if (!user) invokeOperationError('errors.entity.notfound');
  const auth_token = await user.generateAuthToken();
  res.json(auth_token);
})

const userStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([{
    "$group": {
      _id: "$role",
      count: {
        "$sum": 1
      }
    }
  }])
  res.json(stats);
})


module.exports = {
  updateScholarship,
  getUserScholarshipsById,
  updateUser,
  syncAllPlayersBuff,
  recheckPendingStakes,
  grantToken,
  userStats
};