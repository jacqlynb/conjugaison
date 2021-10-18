const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'french',
  charset: 'utf8',
});

app.get('/api/verb', (req, res) => {
  const { group } = req.query;

  try {
    const query = getRandomVerbQuery(group);

    connection.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      }
      res.json(results[0]);
    });
  } catch (error) {
    console.log(error);

    res.status(400).send(error.message);
  }
});

app.get('/api/verbs/:verb', (req, res) => {
  const { verb } = req.params;

  connection.query(
    `SELECT infinitive 
      FROM test 
      WHERE infinitive 
      COLLATE utf8_general_ci=${connection.escape(verb)}`,
    (error, results) => {
      if (error || results.length === 0) {
        res.status(404).send;
      }
      res.json(results[0]);
    }
  );
});

app.get('/api/conjugation', (req, res) => {
  const { tense, pronoun, infinitive } = req.query;

  try {
    const query = buildConjugationQuery(tense, pronoun, infinitive);

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

function getRandomVerbQuery(group) {
  const verbGroup = getVerbGroup(group);

  return `SELECT infinitive 
            FROM test 
            WHERE verb_group="${verbGroup}"
            AND freq_index > 25
            ORDER BY RAND()
            LIMIT 1`;
}

function getVerbGroup(group) {
  if (group === '' || group == null) {
    throw new Error('Missing verb group');
  }

  const allowedGroups = [
    'er',
    'ir',
    'irregular-ir',
    'irregular-re',
    'irregular-oir',
  ];

  if (!allowedGroups.includes(group)) {
    throw new Error('Invalid verb group');
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
      throw new Error('Invalid verb tense');
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
      throw new Error('Invalid pronoun');
  }
}

function getSimpleTenseQuery(tense, pronounType, infinitive) {
  const column = tense + '_' + pronounType;

  return `SELECT ${column} 
            AS conjugation 
            FROM test 
            WHERE infinitive=${connection.escape(infinitive)}`;
}

function getComposedTenseQuery(auxilliaryTense, pronounType, infinitive) {
  return `SELECT CONCAT(
            (
                SELECT ${auxilliaryTense + '_' + pronounType}  
                FROM test 
                WHERE infinitive=(
                    SELECT SUBSTRING_INDEX(compound_verb, ';', 1) 
                    FROM test 
                    WHERE infinitive=${connection.escape(infinitive)}
                )
            ), " ", past_participle) 
        AS conjugation
        FROM test 
        WHERE infinitive=${connection.escape(infinitive)};`;
}

app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = {
  app,
};
