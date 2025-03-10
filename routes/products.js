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

const client = new productSystem.ProductSystem('europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443', grpc.credentials.createSsl());

router.post('/', async (req, res) => {

  const data = req.body;

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
      client.GetProductsInSystem(request, (error, response) => {
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

  try {
    const response = await new Promise((resolve,reject)=>{
      client.GetProvidersForZone({zoneId: data.zoneId}, (error, response) => {
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