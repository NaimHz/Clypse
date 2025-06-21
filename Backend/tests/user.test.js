const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const config = require('../src/config/config');
const { User } = require('../src/models');
let expect;

before(async function () {
  ({ expect } = await import('chai'));
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
});

describe("Inscription et Suppression d'Utilisateur", function () {
  it('devrait créer un utilisateur puis le supprimer', async function () {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/v1/auth/register')
      .send({
        name: 'Temporary User',
        email: uniqueEmail,
        password: 'Password123!',
      });
    expect(res.statusCode).to.equal(201);
    const userId = res.body.user.id;

    await User.findByIdAndDelete(userId);

    const userInDb = await User.findById(userId);
    expect(userInDb).to.be.null;
  });
});
