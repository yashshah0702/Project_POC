const fs = require('fs');
const path = require('path');

module.exports = (sequelize) => {
  const models = {};
  const files = fs.readdirSync(__dirname).filter(file =>
    file !== 'index.js' && file.endsWith('.js')
  );

  for (const file of files) {
    const model = require(path.join(__dirname, file))(sequelize);
    models[model.name] = model;
  }

  return models;
};