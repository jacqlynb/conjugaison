const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'french',
});

const ENTRY = {
  LEMMA: 2,
  CATEGORY: 3,
  FREQ_FILMS: 6,
  FREQ_BOOKS: 7,
};

const VERB_CODE = 'VER';

function seed() {
  const file = fs.readFileSync('../db/Lexique383.tsv', 'utf-8');
  const lines = file.split('\n');

  lines.forEach((line) => {
    const columns = line.split('\t');
    if (columns[ENTRY.CATEGORY] === VERB_CODE) {
      const infinitive = columns[ENTRY.LEMMA];
      const freq =
        (Number(columns[ENTRY.FREQ_FILMS]) +
          Number(columns[ENTRY.FREQ_BOOKS])) /
        2;
      const query = `INSERT INTO frequency(verb, freq_index) VALUES("${infinitive}", "${freq}")`;

      connection.query(query, (error, results) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  console.log('Finished seeding TABLE frequency');
}

seed();
