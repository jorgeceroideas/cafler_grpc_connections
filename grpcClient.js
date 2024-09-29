const grpc = require('@grpc/grpc-js');
const grpcReflection = require('grpc-reflection-js');
const protoLoader = require('@grpc/proto-loader');

const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb');

const fs = require('fs');
const options = {
  'grpc.initial_reconnect_backoff_ms': 10000,
  'grpc.max_reconnect_backoff_ms': 10000
};

// Configura la URL del servidor de reflexión
const grpcReflectionServer = 'europe-logistics-cafler-development-gseahwh0c2cqh7e2.francecentral-01.azurewebsites.net:443'; 

const reflectionClient = new grpcReflection.Client(
  grpcReflectionServer,
  grpc.credentials.createSsl(),
  options
);

async function listAndDescribeServices() {
  try {
    console.log('Requesting list of services...');
    const services = await reflectionClient.listServices();
    console.log('Received list of services:');
    console.log(services);

    for (let i = 0; i < services.length; i++)
    {
      describeService(services[i]);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

async function describeService(serviceName) {
  try {
    const root = await reflectionClient.fileContainingSymbol(serviceName);
    const service = root.lookupService(serviceName);
    console.log(`Service: ${serviceName}`);
    console.log(`---`);
    service.methodsArray.forEach((method,i) => {
      // console.log(i,method)
      // console.log("Method:",method.name);
      describeMethod(serviceName,method.name);
    });
    console.log(`---------------------------------`);

    // Guardar el archivo .proto
    const protoContent = JSON.stringify(root);
    const fileName = `${serviceName.replace(/\./g, '_')}.proto`;
    fs.writeFileSync(fileName, protoContent);
    console.log(`Archivo .proto guardado como ${fileName}`);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function describeMethod(serviceName, methodName) {
  try {
    const root = await reflectionClient.fileContainingSymbol(serviceName);
    const service = root.lookupService(serviceName);
    const method = service.methods[methodName];
    if (method) {
      console.log(`Method: ${method.name}`);
      console.log(`Request Type: ${method.requestType}`);
      console.log(`Response Type: ${method.responseType}`);
      
      const requestType = root.lookupType(method.requestType);
      console.log("Class:",method.parent.name);
      console.log("Proto:",method.parent.parent.filename);

      console.log('Request Fields:');
      requestType.fieldsArray.forEach(field => {
        console.log(`Field: ${field.name}, Type: ${field.type}`);
      });
      console.log(`******************************`);
    } else {
      console.log(`Method ${methodName} not found in service ${serviceName}`);
    }
  } catch (err) {
    console.error('Error:', err);
  }

}

listAndDescribeServices(); 

module.exports = {
  listAndDescribeServices,
  describeService,
  describeMethod
};