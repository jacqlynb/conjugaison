const fs = require('fs');
const mysql = require('mysql');
const thirdGroupVerbs = require('./irregularIRVerbs.js');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'french',
});

connection.query('SELECT * FROM test', (error, results) => {
  if (results == null) {
    throw new Error("test table doesn't exist");
  }
  if (results.length === 0) {
    seed(connection);
    connection.end();
  }
});

const seed = (connection) => {
  console.log('seeding test data...');
  const file = fs.readFileSync('verbs.csv', 'utf-8');
  const lines = file.split('\n');

  lines.forEach((rawLine) => {
    const line = rawLine.replace(/(?:,,)|(?:,$)|(?:,\n)]/g, (value) => {
      if (value === ',,') return ', ,';
      else return ', ';
    });
    const infinitive = line.split(',')[0];
    const verbGroup = getVerbGroup(infinitive);
    const formattedLine = line
      .split(',')
      .map((value) => '"' + value + '"')
      .join(',');

    connection.query(
      `INSERT INTO test(
            infinitive,
            gerund,
            present_participle,
            past_participle,
            compound_verb,
            indicative_present_fps,
            indicative_present_sps,
            indicative_present_tps,
            indicative_present_fpp,
            indicative_present_spp,
            indicative_present_tpp,
            indicative_imperfect_fps,
            indicative_imperfect_sps,
            indicative_imperfect_tps,
            indicative_imperfect_fpp,
            indicative_imperfect_spp,
            indicative_imperfect_tpp,
            indicative_past_historic_fps,
            indicative_past_historic_sps,
            indicative_past_historic_tps,
            indicative_past_historic_fpp,
            indicative_past_historic_spp,
            indicative_past_historic_tpp,
            indicative_future_fps,
            indicative_future_sps,
            indicative_future_tps,
            indicative_future_fpp,
            indicative_future_spp,
            indicative_future_tpp,
            indicative_conditional_fps,
            indicative_conditional_sps,
            indicative_conditional_tps,
            indicative_conditional_fpp,
            indicative_conditional_spp,
            indicative_conditional_tpp,
            subjunctive_present_fps,
            subjunctive_present_sps,
            subjunctive_present_tps,
            subjunctive_present_fpp,
            subjunctive_present_spp,
            subjunctive_present_tpp,
            subjunctive_imperfect_fps,
            subjunctive_imperfect_sps,
            subjunctive_imperfect_tps,
            subjunctive_imperfect_fpp,
            subjunctive_imperfect_spp,
            subjunctive_imperfect_tpp,
            imperative_fps,
            imperative_sps,
            imperative_tps,
            imperative_fpp,
            imperative_spp,
            imperative_tpp,
            verb_group
        )
        VALUES(
            ${formattedLine}, "${verbGroup}"
        )`,
      (error, results) => {
        if (error) {
          throw error;
        }
      }
    );
  });
  console.log('finished seeding');
};

function getVerbGroup(infinitive) {
  if (/.+er$/.test(infinitive)) {
    return infinitive === 'aller' ? 'irregular-er' : 'er';
  }
  if (/.+oir$/.test(infinitive)) {
    return 'irregular-oir';
  }
  if (/.+ir$/.test(infinitive)) {
    return thirdGroupVerbs.irregularIRVerbs.includes(infinitive)
      ? 'irregular-ir'
      : 'ir';
  }
  if (/.+ïr/.test(infinitive)) {
    return 'irregular ir';
  }
  if (/.+re$/.test(infinitive)) {
    return 'irregular-re';
  } else {
    return null;
  }
}
