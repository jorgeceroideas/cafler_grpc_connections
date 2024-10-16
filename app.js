/*const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Cargar el archivo .env correspondiente
dotenv.config({ path: path.resolve(__dirname, envFile) });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const driverRouter = require('./routes/drivers');
const zonesRouter = require('./routes/zones');
const productsRouter = require('./routes/products');
const ganttRouter = require('./routes/gantt');
const servicesRouter = require('./routes/services');
const servicesmapRouter = require('./routes/servicesmap');
const availabilitiesRouter = require('./routes/availabilities');
const clientsRouter = require('./routes/clients');
const algorithmsRouter = require('./routes/algorithms');

app.use('/drivers', driverRouter);
app.use('/zones', zonesRouter);
app.use('/products', productsRouter);
app.use('/gantt', ganttRouter);
app.use('/services', servicesRouter);
app.use('/services-map', servicesmapRouter);
app.use('/availabilities', availabilitiesRouter);
app.use('/clients', clientsRouter);
app.use('/algorithms', algorithmsRouter);

const options = {
  key: fs.readFileSync('private.pem'),
  cert: fs.readFileSync('public.pem')
};

https.createServer(options, app).listen(port, () => {
  console.log(`Servidor escuchando en https://localhost:${port}`);
});*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Cargar el archivo .env correspondiente
dotenv.config({ path: path.resolve(__dirname, envFile) });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const driverRouter = require('./routes/drivers');
const zonesRouter = require('./routes/zones');
const productsRouter = require('./routes/products');
const ganttRouter = require('./routes/gantt');
const servicesRouter = require('./routes/services');
const servicesmapRouter = require('./routes/servicesmap');
const availabilitiesRouter = require('./routes/availabilities');
const clientsRouter = require('./routes/clients');
const algorithmsRouter = require('./routes/algorithms');

app.use('/drivers', driverRouter);
app.use('/zones', zonesRouter);
app.use('/products', productsRouter);
app.use('/gantt', ganttRouter);
app.use('/services', servicesRouter);
app.use('/services-map', servicesmapRouter);
app.use('/availabilities', availabilitiesRouter);
app.use('/clients', clientsRouter);
app.use('/algorithms', algorithmsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});