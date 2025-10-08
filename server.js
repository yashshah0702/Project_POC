require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const defineModels = require('./src/model');
const dbConfig = require('./src/config/db.config'); // Import the config
const routes = require('./src/route')

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
app.use(express.json());
app.use((req, res, next) => {
  req.models = models;
  next();
});
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Server is started and running successfully...');
});


sequelize.sync({alter:true,logging:false}).then(() => {
  console.log('All tables synced!');
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
}).catch(err => {
  console.error('Unable to sync database:', err);
});


