const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirnam, 'inventory.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if(err){
    console.error('Database Connection error: ', err.message);
  }
  else{
    console.log('Connected to the SQLite database');
    createTables();
  }
});

function createTables(){
  db.run(
    `CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS Supplier (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_info TEXT,
    email TEXT
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lastname TEXT NOT NULL,
    firstname TEXT NOT NULL,
    address TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_info TEXT
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS Orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total_amount REAL NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS Order_Items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES Orders(order_id),
    FOREIGN KEY(product_id) REFERENCES Products(product_id)
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(products_id)
    )`
  );

  console.log('Database Tables Created.');
}

function insertProduct(product, callback){
  const {name, description, price, quantity} = product;

  const insertQuery = `INSERT INTO Products (name, description, price, quantity) VALUES (?,?,?,?)`;

  db.run(insertQuery, [name, description, price, quantity], function(err){
    if(err){
      console.error('Error adding products: ', err.message);
      callback(err, null);
    }
    else{
      console.log(`Product added with ID: ${this.lastID}`);
      callback(null, this.lastID);
    }
  });
}

function getAllProducts(callback){
  const query = 'SELECT * FROM Products';

  db.all(query, (err, rows) => {
    if(err){
      console.error('Error Retrieving products: ', err.message);
      callback(err, []);
    }
    else{
      callback(null, rows);
    }
  });
}

function insertSupplier(supplier, callback){
  const {name, contact, email} = supplier;

  const insertQuery = `INSERT INTO Supplier (name, contact_info, email) VALUES (?,?,?)`;

  db.run(insertQuery, [name, contact, email], function(err){
    if(err){
      console.error('Error Adding Supplier: ', err.message);
      callback(err, null);
    }
    else{
      console.log(`Supplier Added: ${this.lastID}`);
      callback(null, this.lastID);
    }
  });
}

function getAllSuppliers(callback){
  const query = 'SELECT * FROM Supplier';

  db.all(query, (err, rows) => {
    if(err){
      console.error('Error in retrieving Supplier: ', err.message);
      callback(err, []);
    }
    else{
      callback(null, rows);
    }
  });
}

function insertCustomer(customer, callback){
  const {lastname, firstname, address, email, contact} = customer;

  const insertQuery = `INSERT INTO Customer(lastname, firstname, address, email, contact_info) VALUES (?,?,?,?,?)`;

  db.run(insertQuery, [lastname, firstname, address, email, contact], function(err){
    if(err){
      console.error('Error in Adding Customer: ', err.message);
    }
    else{
      console.log(`Customer Added: ${this.lastID}`);
      callback(null, this.lastID);
    }
  });
}

function getAllCustomer(callback){
  const query = 'SELECT * FROM Customer';

  db.all(query, (err, rows) => {
    if(err){
      console.error('Error in Retrieving Customer: ', err.message);
      callback(err, []);
    }
    else{
      callback(null, rows);
    }
  });
}

module.exports = {
  insertProduct,
  getAllProducts,
  insertSupplier,
  getAllSuppliers,
  insertCustomer,
  getAllCustomer,
  createTables
};