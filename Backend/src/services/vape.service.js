const httpStatus = require('http-status');
const { Vape } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateUniqueVapeCode } = require('../utils/seedData');

/**
 * Create a vape
 * @param {Object} vapeBody
 * @returns {Promise<Vape>}
 */
const createVape = async (vapeBody) => {
  if (await Vape.isCodeTaken(vapeBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }
  if (await Vape.isSerialNumberTaken(vapeBody.serialNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Serial number already taken');
  }
  return Vape.create(vapeBody);
};

/**
 * Query for vapes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVapes = async (filter, options) => {
  const vapes = await Vape.paginate(filter, options);
  return vapes;
};

/**
 * Get vape by id
 * @param {ObjectId} id
 * @returns {Promise<Vape>}
 */
const getVapeById = async (id) => {
  return Vape.findById(id);
};

/**
 * Get vape by code
 * @param {string} code
 * @returns {Promise<Vape>}
 */
const getVapeByCode = async (code) => {
  return Vape.findOne({ code });
};

/**
 * Update vape by id
 * @param {ObjectId} vapeId
 * @param {Object} updateBody
 * @returns {Promise<Vape>}
 */
const updateVapeById = async (vapeId, updateBody) => {
  const vape = await getVapeById(vapeId);
  if (!vape) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vape not found');
  }
  if (updateBody.code && (await Vape.isCodeTaken(updateBody.code, vapeId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }
  if (updateBody.serialNumber && (await Vape.isSerialNumberTaken(updateBody.serialNumber, vapeId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Serial number already taken');
  }
  Object.assign(vape, updateBody);
  await vape.save();
  return vape;
};

/**
 * Link vape to user
 * @param {string} code
 * @param {ObjectId} userId
 * @returns {Promise<Vape>}
 */
const linkVapeToUser = async (code, userId) => {
  const vape = await getVapeByCode(code);
  if (!vape) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vape not found');
  }
  if (vape.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Vape is already linked to a user');
  }

  vape.userId = userId;
  vape.linkedAt = new Date();
  await vape.save();
  return vape;
};

/**
 * Unlink vape from user
 * @param {ObjectId} vapeId
 * @param {ObjectId} userId
 * @returns {Promise<Vape>}
 */
const unlinkVapeFromUser = async (vapeId, userId) => {
  const vape = await getVapeById(vapeId);
  if (!vape) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vape not found');
  }
  if (!vape.userId || !vape.userId.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Vape is not linked to this user');
  }

  vape.userId = null;
  vape.linkedAt = null;
  await vape.save();
  return vape;
};

/**
 * Delete vape by id
 * @param {ObjectId} vapeId
 * @returns {Promise<Vape>}
 */
const deleteVapeById = async (vapeId) => {
  const vape = await getVapeById(vapeId);
  if (!vape) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vape not found');
  }
  await vape.remove();
  return vape;
};

/**
 * Get vapes by user id
 * @param {ObjectId} userId
 * @returns {Promise<Vape[]>}
 */
const getVapesByUserId = async (userId) => {
  return Vape.find({ userId });
};

/**
 * Generate a unique vape code that doesn't already exist in the database
 * @returns {Promise<string>}
 */
const generateNewVapeCode = async () => {
  let isUnique = false;
  let code;

  // Try to generate a unique code up to 10 times
  for (let attempt = 0; attempt < 10; attempt++) {
    code = generateUniqueVapeCode();
    // eslint-disable-next-line no-await-in-loop
    const existingVape = await Vape.findOne({ code });
    if (!existingVape) {
      isUnique = true;
      break;
    }
  }

  if (!isUnique) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to generate unique vape code');
  }

  return code;
};

module.exports = {
  createVape,
  queryVapes,
  getVapeById,
  getVapeByCode,
  updateVapeById,
  deleteVapeById,
  linkVapeToUser,
  unlinkVapeFromUser,
  getVapesByUserId,
  generateNewVapeCode,
};
