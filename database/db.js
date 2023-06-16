const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/storage/database.sqlite', // Caminho para o arquivo do banco de dados SQLite
});

// Defina aqui os modelos das suas tabelas usando o sequelize.define()

// Exporte o objeto sequelize para ser usado em outros módulos
module.exports = sequelize;
