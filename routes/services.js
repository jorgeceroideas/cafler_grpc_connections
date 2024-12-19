const express = require('express');
const router = express.Router();
const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const grpcClient = require('../grpcClient');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('Cafler_Api_InteropLibrary_ProductApi_ServiceManagerSystem_ServiceManagerSystem.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const serviceSystem = protoDescriptor.Cafler.Api.InteropLibrary.ProductApi.ServiceManagerSystem;

const client = new serviceSystem.ServiceManagerSystem(`${process.env.GRPC_URL}`, grpc.credentials.createSsl());

const metadata = new grpc.Metadata();

function addAuthToken(token) {
    // Eliminar cualquier valor existente para "Authorization"
    metadata.remove('Authorization');
    // Agregar el nuevo token Bearer
    metadata.add('Authorization', token);
}

router.post('/', async (req, res) => {

  const data = req.body;
  var resps = [];

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"queryFilter": data.queryFilter,
			"zoneId": data.zoneId,
			"date": data.date,
			"includeUnpaidOrders": data.includeUnpaidOrders,
			"startingServerPage": data.startingServerPage,
		};

		const response = await new Promise((resolve,reject)=>{
			const call = client.GetServicesOverview(request, metadata);

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
		// res.send(resp);
		const unifiedServices = response.reduce((acc, curr) => {
		  return acc.concat(curr.services);
		}, []);
		res.send({ services: unifiedServices });
  }
  catch (error) {
  	console.log(error);
    res.status(500).send('Error al listar los servicios');
  }
});

router.post('/add', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"zoneId":data.zoneId,
			"originAddress":data.originAddress,
			"originAddressDetails":data.originAddressDetails,
			"originAddressGeopoint":data.originAddressGeopoint,
			"originContactData":data.originContactData,
			"destinationAddress":data.destinationAddress,
			"destinationAddressDetails":data.destinationAddressDetails,
			"destinationAddressGeopoint":data.destinationAddressGeopoint,
			"destinationContactData":data.destinationContactData,
			"vehicleData":data.vehicleData,
			"transferType":data.transferType,
			"serviceStartDate":data.serviceStartDate,
			"serviceEndDate":data.serviceEndDate,
			"comments":data.comments,
			"bookedProducts":data.bookedProducts,
			"clientId":data.clientId
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.CreateService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al guardar el servicio');
  }
});

router.post('/update', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash":data.orderHash,
			"clientId":data.clientId,
			"originContactData":data.originContactData,
			"destinationContactData":data.destinationContactData,
			"vehicleData":data.vehicleData,
			"serviceStartDate":data.serviceStartDate,
			"serviceEndDate":data.serviceEndDate,
			"comments":data.comments,
			"toppings":data.toppings
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.UpdateOrder(request, metadata, (error, response) => {
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
    res.status(500).send('Error al editar el servicio');
  }
});

router.post('/assing-provider', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash":data.orderHash,
			"productId":data.productId,
			"providerId":data.providerId,
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.AssignProviderToProductInService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al asignar proveedor al servicio');
  }
});

router.get('/details', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.GetServiceDetails(request, metadata, (error, response) => {
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
    res.status(500).send('Error al mostrar el servicio');
  }
});

router.get('/toppings', async (req, res) => {

  const data = req.query;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.GetServiceToppings(request, metadata, (error, response) => {
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
    res.status(500).send('Error al mostrar los toppings del servicio');
  }
});

router.post('/assign-driver', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"nodeId": data.nodeId,
			"driverId": data.driverId,
			"orderHash": data.orderHash,
			"isSweeperAssignation": data.isSweeperAssignation
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.AssignServiceToDriver(request, metadata, (error, response) => {
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
    res.status(500).send('Error al asignar conductor a servicio');
  }
});

router.post('/cancel', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"cancellationFlag": data.cancellationFlag,
			"cancellationBillingMessage": data.cancellationBillingMessage
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.CancelService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al cancelar los servicios');
  }
});

router.post('/update-contact', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"originContactName": data.originContactName,
			"origingContactPhoneNumber": data.origingContactPhoneNumber,
			"originContactEmailAdddress": data.originContactEmailAdddress,
			"destinationContactName": data.destinationContactName,
			"destinationContactPhoneNumber": data.destinationContactPhoneNumber,
			"destinationContactEmailAddress": data.destinationContactEmailAddress,
			"isOriginContactExternal": data.isOriginContactExternal,
			"isDestinationContactExternal": data.isDestinationContactExternal
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.UpdateContactInformation(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar los datos de contacto');
  }
});

router.post('/add-overdraft', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"concept": data.concept,
			"comment": data.comment,
			"price": data.price
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.AddOverdraftToService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al agregar sobregiro al servicio');
  }
});

router.post('/add-topping', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"toppingId": data.toppingId,
			"serviceConfiguration": data.serviceConfiguration
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.AddToppingToService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al agregar toppings al servicio');
  }
});

router.post('/remove-topping', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"toppingId": data.toppingId
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.RemoveToppingFromService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al remover toppings del servicio');
  }
});

router.post('/update-status', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"desiredStatus": data.desiredStatus
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.UpdateOrderStatus(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar status del servicio');
  }
});

router.post('/update-price', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"productId": data.productId,
			"price": data.price
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.UpdateProductPrice(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar status del servicio');
  }
});

router.post('/add-provider', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"productId": data.productId,
			"providerId": data.providerId
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.AssignProviderToProductInService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al agregar toppings al servicio');
  }
});

router.post('/update-assigned-start-time', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"desiredAssignedStartTime": data.desiredAssignedStartTime,
			"desiredAssignedEndTime": data.desiredAssignedEndTime,
			"nodeId": data.nodeId,
			"orderHash": data.orderHash
		};
		
		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.UpdateAssignedStartTime(request, metadata, (error, response) => {
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
    res.status(500).send('Error al actualizar la hora de asignacion');
  }
});

router.post('/add-internal-comment', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHash": data.orderHash,
			"message": data.message,
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.AddInternalCommentToService(request, metadata, (error, response) => {
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
    res.status(500).send('Error al agregar comentario interno');
  }
});

router.post('/send-messages-for-confirm-services', async (req, res) => {

  const data = req.body;

  const bearer = req.headers.authorization;
  const token = req.headers.authorization?.split(' ')[1];

  addAuthToken(bearer);

  try {
		const request = {
			"orderHashes": data.orderHashes,
			"sendMessageService": data.sendMessageService,
		};

		console.log(request);

		const response = await new Promise((resolve,reject)=>{
			client.SendMessagesForConfirmServices(request, metadata, (error, response) => {
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
    res.status(500).send('Error al confirmar servicios');
  }
});

module.exports = router;