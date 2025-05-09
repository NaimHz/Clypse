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

const queryVapes = async (filter, options) => {
  const vapes = await Vape.paginate(filter, options);
  return vapes;
};


const getVapeById = async (id) => {
  return Vape.findById(id);
};

const getVapeByCode = async (code) => {
  return Vape.findOne({ code });
};

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

const deleteVapeById = async (vapeId) => {
  const vape = await getVapeById(vapeId);
  if (!vape) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vape not found');
  }
  await vape.remove();
  return vape;
};

const getVapesByUserId = async (userId) => {
  return Vape.find({ userId });
};

const generateNewVapeCode = async () => {
  let isUnique = false;
  let code;

  for (let attempt = 0; attempt < 10; attempt++) {
    code = generateUniqueVapeCode();
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
