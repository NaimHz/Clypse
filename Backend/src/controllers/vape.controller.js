const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vapeService } = require('../services');

const createVape = catchAsync(async (req, res) => {
  const vape = await vapeService.createVape(req.body);
  res.status(httpStatus.CREATED).send(vape);
});

const getVapes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['code', 'serialNumber', 'model', 'brand', 'isActive', 'userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await vapeService.queryVapes(filter, options);
  res.send(result);
});

const getVape = catchAsync(async (req, res) => {
  const vape = await vapeService.getVapeById(req.params.vapeId);
  if (!vape) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vape not found');
  }
  res.send(vape);
});

const updateVape = catchAsync(async (req, res) => {
  const vape = await vapeService.updateVapeById(req.params.vapeId, req.body);
  res.send(vape);
});

const deleteVape = catchAsync(async (req, res) => {
  await vapeService.deleteVapeById(req.params.vapeId);
  res.status(httpStatus.NO_CONTENT).send();
});

const linkVape = catchAsync(async (req, res) => {
  const vape = await vapeService.linkVapeToUser(req.body.code, req.user.id);
  res.send(vape);
});

const unlinkVape = catchAsync(async (req, res) => {
  const vape = await vapeService.unlinkVapeFromUser(req.params.vapeId, req.user.id);
  res.send(vape);
});

const getUserVapes = catchAsync(async (req, res) => {
  const vapes = await vapeService.getVapesByUserId(req.user.id);
  res.send(vapes);
});

module.exports = {
  createVape,
  getVapes,
  getVape,
  updateVape,
  deleteVape,
  linkVape,
  unlinkVape,
  getUserVapes,
};
