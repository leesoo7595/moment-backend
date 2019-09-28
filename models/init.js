const Sequelize = require('sequelize');
const {Post} = require('./Post');
const credentials = require('../credentials/credentials');
let initiated = false;
const sequelize = process.env.NODE_ENV === "PRODUCTION"
    ? new Sequelize(
        process.env.RDS_DB_NAME,
        process.env.RDS_USERNAME,
        process.env.RDS_PASSWORD, {
            host: process.env.RDS_HOSTNAME,
            dialect: credentials["database"]["dialect"]
        }
    )
    : new Sequelize(
        credentials["database"]["name"],
        credentials["database"]["id"],
        credentials["database"]["password"], {
            host: credentials["database"]["host"],
            dialect: credentials["database"]["dialect"]
        });

/**
 * initiate models;
 * @returns {Promise<this>}
 */
function init() {
    Post.init(sequelize);
    return process.argv.indexOf("db") > 0 ? drop().then(setting) : setting();
}

function setting() {
    return sequelize.sync().then(() => initiated = true).then(() => console.log("synchronized"));
}

function drop() {
    return sequelize.drop().then(console.log);
}

/**
 *  connect database
 * @returns {Promise<this | never>}
 */
module.exports = () =>
    sequelize
        .authenticate()
        .then(() => console.log("connection success"))
        .then(init)
        .catch(err => console.error("connection failed", err));