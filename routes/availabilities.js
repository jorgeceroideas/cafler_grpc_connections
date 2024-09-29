const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_AvailabilitySystem_AvailabilitySystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const availabilitySystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.AvailabilitySystem;

const client = new availabilitySystem.AvailabilitySystem('europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443', grpc.credentials.createSsl());

router.post('/', async (req, res) => {

  const data = req.body;
  
  try {

  	const request = {
			requestStartDate: data.requestStartDate,
			requestEndDate: data.requestEndDate,
			zoneId: data.zoneId
  	};

  	const response = await new Promise((resolve,reject)=>{
			client.GetAvailabilities(request, (error, response) => {
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
    res.status(500).send('Error al listar las disponibilidades');
  }
});

router.post('/block', async (req, res) => {

  const data = req.body;
  
  try {

  	const request = {
			blockStartTime: data.blockStartTime,
			blockEndTime: data.blockEndTime,
			blockDates: data.blockDates,
			blockedProducts: data.blockedProducts
  	};

  	const response = await new Promise((resolve,reject)=>{
			client.BlockAvailability(request, (error, response) => {
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
  	console.log("error",error);
    res.status(500).send('Error al bloquear las disponibilidades');
  }
});

module.exports = router;