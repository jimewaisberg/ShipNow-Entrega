const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('node:fs');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { DIRECTORIES } = require('../../src/config/multer.config');

describe('Módulo 7 - Seguridad de archivos', function () {
  let user;

  const archivos = () =>
    fs.readdirSync(DIRECTORIES.user);

  before(async function () {
    fs.mkdirSync(DIRECTORIES.user, { recursive: true });

    user = await User.create({
      first_name: 'Seguridad',
      last_name: 'Uploads',
      email: `seguridad-${new mongoose.Types.ObjectId()}@test.com`,
      age: 25,
      password: 'password123'
    });
  });

  after(async function () {
    if (user) {
      await User.deleteOne({ _id: user._id });
    }
  });

  it('rechaza archivos mayores a 5 MB sin guardarlos', async function () {
    const antes = archivos();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field('documentType', 'DNI')
      .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'grande.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(413);
    expect(response.body.code).to.equal('FILE_TOO_LARGE');
    expect(archivos()).to.have.members(antes);
  });

  it('rechaza un campo de archivo incorrecto', async function () {
    const antes = archivos();

    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field('documentType', 'DNI')
      .attach('archivoIncorrecto', Buffer.from('%PDF-1.7'), {
        filename: 'prueba.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal('UNEXPECTED_FILE_FIELD');
    expect(archivos()).to.have.members(antes);
  });

  it('rechaza documentos de usuarios inexistentes', async function () {
    const antes = archivos();
    const id = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/users/${id}/documents`)
      .field('documentType', 'DNI')
      .attach('file', Buffer.from('%PDF-1.7'), {
        filename: 'prueba.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(404);
    expect(response.body.code).to.equal('USER_NOT_FOUND');
    expect(archivos()).to.have.members(antes);
  });
});
