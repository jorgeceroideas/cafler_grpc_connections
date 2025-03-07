const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_GeneralClientPricesSystem_GeneralClientPricesSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const generalClientPricesSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.GeneralClientPricesSystem;


const client = new generalClientPricesSystem.GeneralClientPricesSystem(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

const metadata = new grpc.Metadata();

function addAuthToken(token) {
    // Eliminar cualquier valor existente para "Authorization"
    metadata.remove('Authorization');
    // Agregar el nuevo token Bearer
    metadata.add('Authorization', token);
}

router.get('/get-prices-by-zone', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.GetGeneralPricesByZone(request, metadata, (error, response) => {
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
    res.status(500).send('Error al obtener precios por zona'+JSON.stringify(error));
  }
});

router.post('/update-prices-fees-by-zone', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId,
      "feeToUpdate": data.feeToUpdate
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.UpdateGeneralPricesFeesByZone(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar precios de tarifa por zona'+JSON.stringify(error));
  }
});

router.post('/update-prices-products-by-zone', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId,
      "productToUpdate": data.productToUpdate
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.UpdateGeneralPricesProductByZone(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar precios de productos por zona'+JSON.stringify(error));
  }
});

router.post('/update-prices-products-by-zone-client', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId,
      "clientId": data.clientId,
      "productToUpdate": data.productToUpdate,
      "planType": data.planType
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.UpdateGeneralPricesProductByZoneAndClient(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar precios de productos por zona y cliente'+JSON.stringify(error));
  }
});


router.get('/get-prices-by-zone-client', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId,
      "clientId": data.clientId
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.GetGeneralPricesByZoneAndClient(request, metadata, (error, response) => {
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
    res.status(500).send('Error al obtener precios por zona y cliente'+JSON.stringify(error));
  }
});

router.post('/update-prices-fees-by-zone-client', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId,
      "clientId": data.clientId,
      "feeToUpdate": data.feeToUpdate
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.UpdateGeneralPricesFeesByZoneAndClient(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar precios de tarifa por zona'+JSON.stringify(error));
  }
});


router.post('/update-prices-product-by-plan', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
    const request = {
      "zoneId": data.zoneId,
      "clientId": data.clientId,
      "planType": data.planType
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.UpdateGeneralPricesProductByClientPlan(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar precios de producto por plan'+JSON.stringify(error));
  }
});

module.exports = router;