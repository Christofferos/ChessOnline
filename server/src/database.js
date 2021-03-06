const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const { Database } = require('sqlite3').verbose();

const databasePath = path.join(__dirname, 'db.sqlite');
const db = new Database(databasePath);

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS matchHistory');
  db.run('DROP TABLE IF EXISTS liveGames');

  db.run('CREATE TABLE users (username TEXT, password TEXT, loggedIn BOOLEAN)');
  db.run('CREATE TABLE matchHistory (winner TEXT, loser TEXT, date TEXT)');
  db.run('CREATE TABLE liveGames (id INTEGER, currentGame TEXT, username1 TEXT, username2 TEXT)');

  db.run('DROP TABLE IF EXISTS admins');
  db.run('DROP TABLE IF EXISTS timeslots');
  db.run('CREATE TABLE timeslots (username TEXT, password TEXT)');
  db.run('CREATE TABLE admins (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  const statement = db.prepare('INSERT INTO admins VALUES (?, ?, ?)');
  statement.run(0, 'kri', 'kri');
  statement.run(1, 'amanda', 'amanda');
  statement.run(2, 'anna', 'anna');
  statement.run(3, 'solbritt', 'solbritt');
  statement.finalize();
});

module.exports = db;
