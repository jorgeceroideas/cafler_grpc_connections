const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_ServiceManagerSystem_ServiceManagerSystemMapModule.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const serviceMapSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.ServiceManagerSystem;

const client = new serviceMapSystem.ServiceManagerSystemMapModule('europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443', grpc.credentials.createSsl());

router.post('/get-drivers', async (req, res) => {

  const data = req.body;
  let resps = [];

  try {
		const request = {
			"orderHash": data.orderHash,
			"filterType": data.filterType,
		};

		const response = await new Promise((resolve,reject)=>{
			const call = client.GetDriversForService(request);

			call.on('data', (response) => {
				resps.push(response);
			});

			call.on('error', (error) => {
			  reject(error);
			});

			call.on('end', () => {
			  resolve(resps);
			  console.log('Stream ended');
			});
		});
		res.send(response);
  }
  catch (error) {
  	console.log(error);
    res.status(500).send('Error al listar los conductores para el servicio');
  }
});

router.post('/services-in-zone', async (req, res) => {

  const data = req.body;
  let resps = [];

  try {
		const request = {
			"zoneId": data.zoneId,
			"date": data.date
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			const call = client.ListServicesInZone(request);

			call.on('data', (response) => {
			  resps.push(response);
			});

			call.on('error', (error) => {
			  reject(error);
			});

			call.on('end', () => {
				resolve(resps);
			  console.log('Stream ended');
			});
		});
		res.send(resps);
  }
  catch (error) {
  	console.log(error);
    res.status(500).send('Error al listar los servicios en la zona');
  }
});

module.exports = router;