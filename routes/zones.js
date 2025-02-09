const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_ZonesSystem_ZoneSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const zonesSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.ZonesSystem;

const client = new zonesSystem.ZoneSystem('europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443', grpc.credentials.createSsl());

router.get('/', async (req, res) => {
  
  try {
  	const response = await new Promise((resolve,reject)=>{
			client.GetZonesInSystem(null, (error, response) => {
			  if (error) {
			    reject(error);
			  } else {
			    resolve(response);
			  }
			});
  	});
  	res.send(response)
  }
  catch (error) {
  	console.log(error);
    res.status(500).send('Error al listar las zonas');
  }
});

module.exports = router;