const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_ClientSystem_ClientSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const clientSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.ClientSystem;

const client = new clientSystem.ClientSystem(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

const metadata = new grpc.Metadata();

function addAuthToken(token) {
    // Eliminar cualquier valor existente para "Authorization"
    metadata.remove('Authorization');
    // Agregar el nuevo token Bearer
    metadata.add('Authorization', token);
}

router.post('/', async (req, res) => {

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  const data = req.body;

  try {
    const request = {};

    console.log(metadata);

    const response = await new Promise((resolve,reject)=>{
      client.GetAllClientsSimplified(request, metadata, (error, response) => {
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
    res.status(500).send('Error al listar clientes simplificado'+JSON.stringify(error));
  }
});

router.post('/get', async (req, res) => {

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  const data = req.body;

  try {
    const request = {};

    console.log(metadata);

    const response = await new Promise((resolve,reject)=>{
      client.GetAllClients(request, metadata, (error, response) => {
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
    res.status(500).send('Error al listar clientes'+JSON.stringify(error));
  }
});

router.post('/add', async (req, res) => {

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  const data = req.body;

  try {
    const request = {
      "clientCompanyName": data.clientCompanyName,
      "companyDescription": data.companyDescription,
      "keyAccountManagerName": data.keyAccountManagerName,
      "isClientActive": data.isClientActive,
      "clientCategory": data.clientCategory,
      "clientType": data.clientType,
      "activitySector": data.activitySector,
      "clientGroup": data.clientGroup,
      "clientSubgroup": data.clientSubgroup,
      "clientAddress": data.clientAddress,
      "clientIdentityData": data.clientIdentityData,
      "additionalContacts": data.additionalContacts,
      "billingInformation": data.billingInformation,
      "comments": data.comments,
      "zoneId": data.zoneId
    };

    console.log(request);

    const response = await new Promise((resolve,reject)=>{
      client.CreateNewClient(request, metadata, (error, response) => {
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
    res.status(500).send('Error al crear el cliente');
  }
});



module.exports = router;