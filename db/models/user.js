'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const project = require('./project');

const user = sequelize.define(
    'user',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userType: {
            type: DataTypes.ENUM('0', '1', '2'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'firstName cannot be null',
                },
                notEmpty: {
                    msg: 'firstName cannot be empty',
                },
            },
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'firstName cannot be null',
                },
                notEmpty: {
                    msg: 'firstName cannot be empty',
                },
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'lastName cannot be null',
                },
                notEmpty: {
                    msg: 'lastName cannot be empty',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'email cannot be null',
                },
                notEmpty: {
                    msg: 'email cannot be empty',
                },
                isEmail: {
                    msg: 'Invalid email id',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'password cannot be null',
                },
                notEmpty: {
                    msg: 'password cannot be empty',
                },
            },
        },
        confirmPassword: {
            type: DataTypes.VIRTUAL,
            set(value) {
                if (this.password.length < 7) {
                    throw new AppError(
                        'Password length must be grater than 7',
                        400
                    );
                }
                if (value === this.password) {
                    const hashPassword = bcrypt.hashSync(value, 10);
                    this.setDataValue('password', hashPassword);
                } else {
                    throw new AppError(
                        'Password and confirm password must be the same',
                        400
                    );
                }
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'user',
    }
);

user.hasMany(project, { foreignKey: 'createdBy' });
project.belongsTo(user, {
    foreignKey: 'createdBy',
});


module.exports = user;

//constraint vs validation
/*
1.---Validation (Sequelize)---
  Layer: Application/ORM layer

  Checked by: Sequelize (before data is sent to the database)

  Definition: Validation in Sequelize refers to rules defined at the model level (e.g., allowNull, isEmail, len, etc.). These rules ensure that the data being submitted meets certain conditions before the data reaches the database

  When checked: Validations are checked first by Sequelize before sending the SQL query to PostgreSQL. If validation fails, the data is not sent to the database, and an error is thrown in the application layer

2.---Constraints (PostgreSQL)---
  Layer: Database layer

  Checked by: PostgreSQL (once the data reaches the database)

  Definition: Constraints are rules applied at the database schema level (e.g., NOT NULL, UNIQUE, FOREIGN KEY, etc.). These constraints ensure the consistency and integrity of the data within the database

  When checked: Constraints are checked after the data passes Sequelize validation and the insert/update query is executed in PostgreSQL. If a constraint is violated, the database rejects the query and throws an error
 */