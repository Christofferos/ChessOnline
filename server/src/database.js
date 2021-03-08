const path = require('path');
const { Database } = require('sqlite3').verbose();

const databasePath = path.join(__dirname, 'db.sqlite');
const db = new Database(databasePath);

db.serialize(async () => {
  /*
  console.log('Database created.');
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS matchHistory');
  db.run('DROP TABLE IF EXISTS liveGames');

  db.run('CREATE TABLE users (username TEXT, password TEXT)');
  db.run('CREATE TABLE matchHistory (winner TEXT, loser TEXT, nrMoves INTEGER, date TEXT)');
  db.run(
    'CREATE TABLE liveGames (id INTEGER, currentGame TEXT, player1 TEXT, player2 TEXT, timeLeft1 INTEGER, timeLeft2 INTEGER)',
  );
  */
});

module.exports = db;
