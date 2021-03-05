const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const { Database } = require('sqlite3').verbose();

const bcrypt = require('bcrypt');

const saltRounds = 10;

const databasePath = path.join(__dirname, 'db.sqlite');
const db = new Database(databasePath);

db.serialize(async () => {
  console.log('create db');
  db.run('DROP TABLE IF EXISTS admins');
  db.run('DROP TABLE IF EXISTS timeslots');
  db.run(
    'CREATE TABLE timeslots (id INTEGER PRIMARY KEY, assistantId INTEGER, time TEXT, bookedBy TEXT)',
  );
  db.run(
    'CREATE TABLE admins (id INTEGER PRIMARY KEY, username TEXT, password TEXT)',
  );

  // Store hash in your password DB.

  console.log('bcrypt');
  await bcrypt.hash('kri', saltRounds, (err, hash) => {
    console.log(hash);
    const statement = db.prepare('INSERT INTO admins VALUES (?, ?, ?)');
    statement.run(0, 'kri', hash);
    statement.finalize();
  });
  await bcrypt.hash('amanda', saltRounds, (err, hash) => {
    console.log(hash);
    const statement = db.prepare('INSERT INTO admins VALUES (?, ?, ?)');
    statement.run(1, 'amanda', hash);
    statement.finalize();
  });
  await bcrypt.hash('anna', saltRounds, (err, hash) => {
    console.log(hash);
    const statement = db.prepare('INSERT INTO admins VALUES (?, ?, ?)');
    statement.run(2, 'anna', hash);
    statement.finalize();
  });
  await bcrypt.hash('solbritt', saltRounds, (err, hash) => {
    console.log(hash);
    const statement = db.prepare('INSERT INTO admins VALUES (?, ?, ?)');
    statement.run(3, 'solbritt', hash);
    statement.finalize();
  });
});

console.log('export');
module.exports = db;
