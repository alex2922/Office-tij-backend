import { database } from "../db/config.js";

const clientTable = `CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(255) ,
    contact VARCHAR(255) ,
    email VARCHAR(255) ,
    gstnum VARCHAR(255),
    address TEXT 
);
`;

const vendorTable = `CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(255) ,
    contact VARCHAR(255) ,
    email VARCHAR(255) ,
    gstnum VARCHAR(255) 
)`;

const supportingDataTable = `CREATE TABLE IF NOT EXISTS supportingData(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    value JSON NOT NULL
)`;

const masterTable = `CREATE TABLE IF NOT EXISTS masterTable (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    entryCreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    invoiceNum VARCHAR(255) NOT NULL,
    dateofBooking VARCHAR(255)  NOT NULL,
    dateOfJourney VARCHAR(255)  NOT NULL,
    service VARCHAR(255) NOT NULL,
    description TEXT,
    PNR VARCHAR(255),
    systemRef VARCHAR(255) NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    vendorGST VARCHAR(255),
    depCity VARCHAR(255),
    arrCity VARCHAR(255),
    passengerName VARCHAR(255) NOT NULL,
    paymentParty VARCHAR(255),
    travelType VARCHAR(255),
    netAmount DECIMAL(10,2) NOT NULL,
    markup DECIMAL(10,2) NOT NULL,
    gst DECIMAL(10,2),
    totalAmount DECIMAL(10,2) NOT NULL,
    modeOfPayment VARCHAR(255) DEFAULT NULL,
    modeOfPaymentForClient VARCHAR(255),
    paymentdatebyclient VARCHAR(255),
    paymenamtbyclient DECIMAL(10,2) ,
    refundDate VARCHAR(255) ,
    refundAmount DECIMAL(10,2),
    cancelCharge DECIMAL(10,2) ,
    refundMode VARCHAR(255)
)`;

const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const modePayments = `CREATE TABLE IF NOT EXISTS modePayments (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
)`;

const documents = `CREATE TABLE IF NOT EXISTS documents (

id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
masterId INT NOT NULL,
ticket VARCHAR(255) NOT NULL,
boardingPass VARCHAR(255) NOT NULL,
FOREIGN KEY (masterId) REFERENCES masterTable(id) ON DELETE CASCADE
)`;

// tables
const tableSetup = async (table, query) => {
  try {
    await database.query(query);

    console.log(`${table} created`);
  } catch (error) {
    console.log(error);
  }
};

const createTables = async () => {
  await tableSetup("clients", clientTable);
  await tableSetup("vendors", vendorTable);
  await tableSetup("supportingData", supportingDataTable);
  await tableSetup("masterTable", masterTable);
  await tableSetup("user", userTable);
  await tableSetup("modePayments", modePayments);
  await tableSetup("documents", documents);
  console.log("Tables created");
};

export { createTables };
