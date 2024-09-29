const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb.js');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_DriverSystem_DriverSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const driverSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.DriverSystem;

const client = new driverSystem.DriverSystem('europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443', grpc.credentials.createSsl());

router.get('/', async (req, res) => {

	const data = req.query;
	var resp = {};

	try {

		const response = await new Promise((resolve,reject)=>{

	    const call = client.GetDriver();

	    // Enviar datos al servidor
	    if (data.nameFilterQuery) {
	    	call.write({ nameFilterQuery: data.nameFilterQuery ?? '' });
	    } else {
	    	call.write({ driverIdFilter: data.driverIdFilter ?? '' });
	    }

	    // Manejar respuestas del servidor
	    call.on('data', (response) => {
	      resp = response;
	    });

	    call.on('error', (error) => {
	      reject(error.code+' '+error.details);
	    });

	    call.on('end', () => {
	    	resolve(resp);
	      console.log('Stream ended');
	    });

	    // Finalizar el stream
	    call.end();
		});
		res.send(resp);

  } catch (error) {
    console.error('Error:', error);
    if (error == '10 Crash') {
    	res.send(resp);
    }else{
    	res.status(500).send('Error al listar drivers');
    }
  }

});

router.post('/add-driver', async (req, res) => {

  const data = req.body;

  try {
		const request = {
		  zoneId: data.zoneId,
		  firstName: data.firstName,
		  lastName: data.lastName,
		  operatorType: data.operatorType,
		  isInternal: data.isInternal,
		  startAddress: data.startAddress,
		  startAddressDetail: data.startAddressDetail,
		  startLatitude: data.startLatitude,
		  startLongitude: data.startLongitude,
		  workdayStartTime: data.workdayStartTime,
		  workdayEndTime: data.workdayEndTime,
		  allowedMotorcycleServiceType: data.allowedMotorcycleServiceType,
		  isActiveUser: data.isActiveUser,
		  mainEmail: data.mainEmail,
		  alternativeEmail: data.alternativeEmail,
		  phoneNumber: data.phoneNumber,
		  alternativePhoneNumber: data.alternativePhoneNumber
		};

		const response = await new Promise((resolve,reject)=>{
			client.AddDriverToSystem(request, (error, response) => {
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
    res.status(500).send('Error al guardar driver');
  }
});

module.exports = router;