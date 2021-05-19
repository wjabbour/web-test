require('source-map-support/register')
const Sequelize = require('sequelize');
import { RouterServer } from './RouterServer'
import * as models from './models'
import { Reservation } from './models/Reservation';
import { Inventory } from './models/Inventory';


(async () => {
  new RouterServer().start(8080)

  const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
    dialect: 'postgres',
    logging: process.env.LOG === 'debug' ? console.log : false,
    models: Object.keys(models).map(k => models[k]),
  })

  Reservation.init({
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    dateTime: Sequelize.DATE,
    size: Sequelize.INTEGER,
  },
  { sequelize,
    modelName: 'reservations',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  Inventory.init({
    start: Sequelize.STRING,
    end: Sequelize.STRING,
    capacity: Sequelize.INTEGER,
  },
  { sequelize,
    modelName: 'inventories',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  await sequelize.sync({
    alter: true
  });
})()
