const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_AlgorithmSystem_AlgorithmSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const algorithmSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.AlgorithmSystem;

const client = new algorithmSystem.AlgorithmSystem(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

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

  const data = req.body;
  var resp = {};

  try {
    const request = {};

    console.log(metadata);

    const response = await new Promise((resolve,reject)=>{
			const call = client.GetAlgorithmicExecutions(request,metadata);

			call.on('data', (response) => {
			  resp = response;
			});

			call.on('error', (error) => {
			  reject(error);
			});

			call.on('end', () => {
				resolve(resp);
			  console.log('Stream ended');
			});
		});
		res.send(resp);
  }
  catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener algoritmos'+JSON.stringify(error));
  }
});

router.post('/add', async (req, res) => {

	const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  const data = req.body;

  try {
		const request = {
			zoneId: data.zoneId,
			targetDate: data.targetDate,
			generalTimeMargin: data.generalTimeMargin,
			exterProviderTimeMargin: data.exterProviderTimeMargin,
			extraToppingTimeMargin: data.extraToppingTimeMargin,
			maxDriverWalkTime: data.maxDriverWalkTime,
			maxDriverPublicTransportTime: data.maxDriverPublicTransportTime,
			sweepCarRadiusInKilometers: data.sweepCarRadiusInKilometers,
			sweepCarMaxArrivalTime: data.sweepCarMaxArrivalTime,
		};

		const response = await new Promise((resolve,reject)=>{
			client.AddNewAssignation(request, metadata, (error, response) => {
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
    res.status(500).send('Error al guardar algoritmo'+JSON.stringify(error));
  }
});

router.post('/apply', async (req, res) => {

	const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  const data = req.body;

  try {
		const request = {
			executionId: data.executionId,
			forcefulOverride: data.forcefulOverride,
		};

		const response = await new Promise((resolve,reject)=>{
			client.ApplyAlgorithmicAssignation(request, metadata, (error, response) => {
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
    res.status(500).send('Error al aplicar el algoritmo'+JSON.stringify(error));
  }
});

router.get('/details', async (req, res) => {

	const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  const data = req.query;

  try {
		const request = {
			executionId: data.executionId
		};

		const response = await new Promise((resolve,reject)=>{
			client.GetAlgoritmicExecutionDetails(request, metadata, (error, response) => {
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
    res.status(500).send('Error al recuperar el algoritmo'+JSON.stringify(error));
  }
});

module.exports = router;