const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser  = require('body-parser');
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Rhsnb321',
    database : 'french'
});

app.get('/verb', (req, res) => {
    const q = `SELECT * 
               FROM test 
               ORDER BY RAND() 
               LIMIT 1`;
    connection.query(q, (error, results) => {
        if (error) throw error;
        res.json(results[0]);
    });
})

app.get('/conjugation', (req, res) => {
    const {mood, tense, pronoun, infinitive} = req.query;
    const q = buildConjugationQuery(mood, tense, pronoun, infinitive);
    connection.query(q, (error, results) => {
        if (error) throw error;
        res.json(results[0]);
    })
})

function getRandomVerbQuery(group) {
    const verbGroup = getVerbGroup(group);

    return `SELECT * 
            FROM test 
            WHERE verb_group="${verbGroup}"
            ORDER BY RAND()
            LIMIT 1`;
}

function getVerbGroup(group) {
    const allowedGroups = ['er', 'ir', 'irregular-ir', 'irregular-re', 'irregular-oir'];

    if (!allowedGroups.includes(group)) {
        throw new Error('Bad group');
    }

    return group;
}

function buildConjugationQuery(mood, tense, pronoun, infinitive) {
    const pronounType = getPronounType(pronoun);
    const column = mood + "_" + tense + "_" + pronounType;
    return `SELECT ${column} 
            AS conjugation 
            FROM test 
            WHERE infinitive="${infinitive}"`;
}

function getPronounType(pronoun) {
    switch (pronoun) {
        case 'je': return 'fps';
        case 'tu': return 'sps';
        case 'elle': return 'tps';
        case 'il': return 'tps';
        case 'nous': return 'fpp';
        case 'vous': return 'spp';
        case 'elles': return 'tpp';
        case 'ils': return 'tpp';
    }
}

app.listen(port, () => console.log(`listening on port ${port}`));