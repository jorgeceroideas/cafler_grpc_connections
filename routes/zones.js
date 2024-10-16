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


const client = new zonesSystem.ZoneSystem(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

const metadata = new grpc.Metadata();

function addAuthToken(token) {
    // Eliminar cualquier valor existente para "Authorization"
    metadata.remove('Authorization');
    // Agregar el nuevo token Bearer
    metadata.add('Authorization', token);
}

router.get('/', async (req, res) => {

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);
  
  try {
  	const response = await new Promise((resolve,reject)=>{
			client.GetZonesInSystem(null, metadata, (error, response) => {
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
  res.status(500).send('ok');
});

module.exports = router;