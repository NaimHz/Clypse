const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getConsumptions = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    vapeId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getConsumption = {
  params: Joi.object().keys({
    consumptionId: Joi.string().custom(objectId),
  }),
};

const recordPuff = {
  params: Joi.object().keys({
    vapeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getConsumptions,
  getConsumption,
  recordPuff,
};
