require('dotenv').config({ quiet: true });
const express = require('express');
const { Sequelize } = require('sequelize');
const defineModels = require('./src/model');
const dbConfig = require('./src/config/db.config'); // Import the config
const routes = require('./src/route')

const port = process.env.PORT || 3000;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectModule: dbConfig.dialectModule,
    dialectOptions: dbConfig.dialectOptions
  }
);

const models = defineModels(sequelize);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  req.models = models;
  next();
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or a specific origin
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Server is started and running successfully, please check now...');
});


sequelize.sync({alter:true,logging:false}).then(() => {
  console.log('Database connected and models synchronized!');
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
  console.error('Unable to sync database:', err);
  process.exit(1);
});


