const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_ProductSystem_ProductSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const productSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.ProductSystem;

const client = new productSystem.ProductSystem(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

const metadata = new grpc.Metadata();

function addAuthToken(token) {
    // Eliminar cualquier valor existente para "Authorization"
    metadata.remove('Authorization');
    // Agregar el nuevo token Bearer
    metadata.add('Authorization', token);
}

router.post('/', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId":data.zoneId,
      "verticalType":data.verticalType,
      "chassisType":data.chassisType,
      "fuelType":data.fuelType,
      "includeToppings":data.includeToppings
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.GetProductsInSystem(request, metadata, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
    res.send(response);
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Error al listar las productos');
  }
});

router.get('/providers', async (req, res) => {

  const data = req.query;
  var resp = {};

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const response = await new Promise((resolve,reject)=>{
      client.GetProvidersForZone({zoneId: data.zoneId}, metadata, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
    res.send(response);
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Error al listar las productos');
  }
});

module.exports = router;