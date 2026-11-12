const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');

const app = require('../../src/app');
const User = require('../../src/models/User');
const { DIRECTORIES } = require('../../src/config/multer.config');

describe('Módulo 7 - Carga de archivos', function () {
  let user;
  const uploadedFiles = [];

  const pdf = Buffer.from(
    '%PDF-1.7\nDocumento de prueba\n%%EOF'
  );

  before(async function () {
    user = await User.create({
      first_name: 'Prueba',
      last_name: 'Uploads',
      email: `uploads-${Date.now()}@test.com`,
      age: 25,
      password: 'password123'
    });
  });

  after(async function () {
    for (const file of uploadedFiles) {
      try {
        fs.unlinkSync(file);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }

    if (user) {
      await User.deleteOne({ _id: user._id });
    }
  });

  it('sube correctamente un documento de usuario', async function () {
    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field('documentType', 'DNI')
      .attach('file', pdf, {
        filename: 'dni.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(201);
    expect(response.body.file.documentType).to.equal('DNI');
    expect(response.body.file.mimetype).to.equal('application/pdf');

    const saved = await User.findById(user._id);
    expect(saved.documents).to.have.lengthOf(1);

    const filePath = path.join(
      DIRECTORIES.user,
      response.body.file.filename
    );

    uploadedFiles.push(filePath);
    expect(fs.existsSync(filePath)).to.equal(true);
  });

  it('rechaza una solicitud sin archivo', async function () {
    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field('documentType', 'DNI');

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal('FILE_REQUIRED');
  });

  it('rechaza un tipo de documento inválido', async function () {
    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field('documentType', 'TIPO_INVALIDO')
      .attach('file', pdf, {
        filename: 'documento.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal('INVALID_DOCUMENT_TYPE');
  });

  it('rechaza contenido que no corresponde a un PDF', async function () {
    const response = await request(app)
      .post(`/api/users/${user._id}/documents`)
      .field('documentType', 'DNI')
      .attach('file', Buffer.from('archivo falso'), {
        filename: 'falso.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(400);
    expect(response.body.code).to.equal('INVALID_FILE_TYPE');
  });

  it('rechaza comprobantes de entregas inexistentes', async function () {
    const nonexistentId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post(`/api/deliveries/${nonexistentId}/proof`)
      .attach('file', pdf, {
        filename: 'comprobante.pdf',
        contentType: 'application/pdf'
      });

    expect(response.status).to.equal(404);
    expect(response.body.code).to.equal('DELIVERY_NOT_FOUND');
  });

  it('sube y asocia un comprobante de entrega', async function () {
    const Delivery = require('../../src/models/Delivery');

    const delivery = await Delivery.create({
      order: new mongoose.Types.ObjectId(),
      destination: 'Buenos Aires'
    });

    let savedFile;

    try {
      const response = await request(app)
        .post(`/api/deliveries/${delivery._id}/proof`)
        .attach('file', pdf, {
          filename: 'comprobante.pdf',
          contentType: 'application/pdf'
        });

      expect(response.status).to.equal(201);
      expect(response.body.file.documentType)
        .to.equal('COMPROBANTE_ENTREGA');

      const saved = await Delivery.findById(delivery._id);
      expect(saved.receipts).to.have.lengthOf(1);

      savedFile = path.join(
        DIRECTORIES.delivery,
        response.body.file.filename
      );

      expect(fs.existsSync(savedFile)).to.equal(true);
    } finally {
      if (savedFile && fs.existsSync(savedFile)) {
        fs.unlinkSync(savedFile);
      }

      await Delivery.deleteOne({ _id: delivery._id });
    }
  });
});
