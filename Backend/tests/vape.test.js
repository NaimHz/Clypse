const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const config = require('../src/config/config');
const { User, Vape } = require('../src/models');
let expect;

describe('CRUD de Vape', function () {
  let adminToken;

  before(async function () {
    ({ expect } = await import('chai'));
    await mongoose.connect(config.mongoose.url, config.mongoose.options);

    const adminEmail = `admin_${Date.now()}@example.com`;
    const adminPassword = 'Password123!';
    await User.create({
      name: 'Test Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    const res = await request(app).post('/v1/auth/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    adminToken = res.body.tokens.access.token;
  });

  it('devrait créer une vape puis la supprimer', async function () {
    const createRes = await request(app)
      .post('/v1/vape')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: `VAPE_${Date.now()}`,
        serialNumber: `SN_${Date.now()}`,
        model: 'Self-Destruct Model',
        brand: 'Clyps',
        batteryLevel: 100,
        isActive: true,
      });
    expect(createRes.statusCode).to.equal(201);
    const vapeId = createRes.body.id;

    await Vape.findByIdAndDelete(vapeId);

    const vapeInDb = await Vape.findById(vapeId);
    expect(vapeInDb).to.be.null;
  });
});
