const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_ServiceManagerSystem_ServiceManagerSystemGanttModule.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const ganttSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.ServiceManagerSystem;

const client = new ganttSystem.ServiceManagerSystemGanttModule('europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443', grpc.credentials.createSsl());

router.post('/', async (req, res) => {

  const data = req.body;
  var resp = {};

  try {
	  
	  const request = {
			zoneId: data.zoneId,
			date: data.date,
			buffer_amount: data.buffer_amount
	  }

	  console.log(request);

	  const response = await new Promise((resolve,reject)=>{

	    const call = client.GenerateGanttData(request);

	    // Manejar respuestas del servidor
	    call.on('data', (response) => {
	    	resp = response;
	    });

	    call.on('error', (error) => {
	      reject('Error al listar drivers',error);
	    });

	    call.on('end', () => {
	    	resolve(resp);
	      console.log('Stream ended');
	    });

	    // Finalizar el stream
	    // call.end();
		});
  	res.send(response);
  }
  catch (error) {
  	console.log(error);
    res.status(500).send('Error al listar los datos del gantt');
  }
});

module.exports = router;