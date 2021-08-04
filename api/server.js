const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const connection = mysql.createConnection({
<<<<<<< HEAD
<<<<<<< HEAD
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'french',
  charset: 'utf8',
});

app.get('/api/verb', (req, res) => {
  const { group } = req.query;
  const q = getRandomVerbQuery(group);
  connection.query(q, (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.get('/api/conjugation', (req, res) => {
  const { tense, pronoun, infinitive } = req.query;
  const q = buildConjugationQuery(tense, pronoun, infinitive);
  connection.query(q, (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});
=======
    host     : 'localhost',
    user     : 'root',
    password : 'Rhsnb321',
    database : 'french',
    charset: 'utf8'
=======
  host: 'localhost',
  user: 'root',
  password: 'Rhsnb321',
  database: 'french',
  charset: 'utf8',
>>>>>>> f1ec849 (big refactor)
});

app.get('/api/verb', (req, res) => {
  const { group } = req.query;
  const q = getRandomVerbQuery(group);
  connection.query(q, (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

app.get('/api/conjugation', (req, res) => {
<<<<<<< HEAD
    const {tense, pronoun, infinitive} = req.query;
    const q = buildConjugationQuery(tense, pronoun, infinitive);
    connection.query(q, (error, results) => {
        if (error) throw error;
        res.json(results[0]);
    })
})
>>>>>>> 8a24855 (add support for all verb tenses)
=======
  const { tense, pronoun, infinitive } = req.query;
  const q = buildConjugationQuery(tense, pronoun, infinitive);
  connection.query(q, (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});
>>>>>>> f1ec849 (big refactor)

function getRandomVerbQuery(group) {
  const verbGroup = getVerbGroup(group);

  return `SELECT infinitive 
            FROM test 
            WHERE verb_group="${verbGroup}"
            ORDER BY RAND()
            LIMIT 1`;
}

function getVerbGroup(group) {
  const allowedGroups = [
    'er',
    'ir',
    'irregular-ir',
    'irregular-re',
    'irregular-oir',
  ];

  if (!allowedGroups.includes(group)) {
    throw new Error('Bad group');
  }

  return group;
}

function buildConjugationQuery(tense, pronoun, infinitive) {
  const pronounType = getPronounType(pronoun);

  switch (tense) {
    case 'indicatif présent':
      return getSimpleTenseQuery('indicative_present', pronounType, infinitive);
    case 'imparfait':
      return getSimpleTenseQuery(
        'indicative_imperfect',
        pronounType,
        infinitive
      );
    case 'passé simple':
      return getSimpleTenseQuery(
        'indicative_past_historic',
        pronounType,
        infinitive
      );
    case 'futur simple':
      return getSimpleTenseQuery('indicative_future', pronounType, infinitive);
    case 'passé composé':
      return getComposedTenseQuery(
        'indicative_present',
        pronounType,
        infinitive
      );
    case 'plus-que-parfait':
      return getComposedTenseQuery(
        'indicative_imperfect',
        pronounType,
        infinitive
      );
    case 'futur antérieur':
      return getComposedTenseQuery(
        'indicative_future',
        pronounType,
        infinitive
      );
    case 'subjonctif présent':
      return getSimpleTenseQuery(
        'subjunctive_present',
        pronounType,
        infinitive
      );
    case 'subjonctif passé':
      return getComposedTenseQuery(
        'subjunctive_present',
        pronounType,
        infinitive
      );
    case 'conditionnel présent':
      return getSimpleTenseQuery(
        'indicative_conditional',
        pronounType,
        infinitive
      );
    case 'conditionnel passé':
      return getComposedTenseQuery(
        'indicative_conditional',
        pronounType,
        infinitive
      );
    case 'impératif':
      return getSimpleTenseQuery('imperative', pronounType, infinitive);
    default:
      throw new Error('invalid tense');
  }
}

function getPronounType(pronoun) {
  switch (pronoun) {
    case 'je':
      return 'fps';
    case 'tu':
      return 'sps';
    case 'elle':
      return 'tps';
    case 'il':
      return 'tps';
    case 'nous':
      return 'fpp';
    case 'vous':
      return 'spp';
    case 'elles':
      return 'tpp';
    case 'ils':
      return 'tpp';
    default:
      throw new Error('invalid pronoun');
  }
<<<<<<< HEAD
}

function getSimpleTenseQuery(tense, pronounType, infinitive) {
  const column = tense + '_' + pronounType;

  return `SELECT ${column} 
            AS conjugation 
            FROM test 
            WHERE infinitive="${infinitive}"`;
}

function getComposedTenseQuery(auxilliaryTense, pronounType, infinitive) {
  return `SELECT CONCAT(
            (
                SELECT ${auxilliaryTense + '_' + pronounType}  
                FROM test 
                WHERE infinitive=(
                    SELECT SUBSTRING_INDEX(compound_verb, ';', 1) 
                    FROM test 
                    WHERE infinitive="${infinitive}"
                )
            ), " ", past_participle) 
        AS conjugation
        FROM test 
        WHERE infinitive="${infinitive}";`;
=======
>>>>>>> f1ec849 (big refactor)
}

function getSimpleTenseQuery(tense, pronounType, infinitive) {
  const column = tense + '_' + pronounType;

  return `SELECT ${column} 
            AS conjugation 
            FROM test 
            WHERE infinitive="${infinitive}"`;
}

function getComposedTenseQuery(auxilliaryTense, pronounType, infinitive) {
  return `SELECT CONCAT(
            (
                SELECT ${auxilliaryTense + '_' + pronounType}  
                FROM test 
                WHERE infinitive=(
                    SELECT SUBSTRING_INDEX(compound_verb, ';', 1) 
                    FROM test 
                    WHERE infinitive="${infinitive}"
                )
            ), " ", past_participle) 
        AS conjugation
        FROM test 
        WHERE infinitive="${infinitive}";`;
}

app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = {
  app,
};
