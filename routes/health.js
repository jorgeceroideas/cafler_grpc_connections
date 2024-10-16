const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('grpc_health_v1_Health.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const health = protoDescriptor.grpc.health.v1;

const client = new health.Health(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

router.post('/check', async (req, res) => {
  try {
  	const data = req.body;
  	const request = {
  		
  	};

  	const response = await new Promise((resolve,reject)=>{
			client.Check(request, (error, response) => {
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
    res.status(500).send('Error');
  }
});

router.post('/watch', async (req, res) => {
  try {
  	const data = req.body;
  	const request = {

  	};

  	const response = await new Promise((resolve,reject)=>{
			client.Watch(request, (error, response) => {
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
    res.status(500).send('Error');
  }
});

module.exports = router;