const { expect, it } = require('@jest/globals');
const request = require('supertest');
const async = require('async');
const { app } = require('./server');
const { irregularIRVerbs } = require('./irregularIRVerbs');

describe('get endpoints', () => {
    it('get -er verb', async () => {
        const { body } = await request(app).get('/verb?group=er');
        expect(body.infinitive).toMatch(/.*er$/);
    });

    it('get -ir verb', async () => {
        const { body } = await request(app).get('/verb?group=ir');
        expect(body.infinitive).toMatch(/.*ir$/);
    });

    it('get irregular-ir verb', async () => {
        const { body } = await request(app).get('/verb?group=irregular-ir');
        expect(irregularIRVerbs).toContain(body.infinitive);
    });

    it('get irregular-re verb', async () => {
        const { body } = await request(app).get('/verb?group=irregular-re');
        expect(body.infinitive).toMatch(/.*re$/);
    });

    it('get irregular-oir verb', async () => {
        const { body } = await request(app).get('/verb?group=irregular-oir');
        expect(body.infinitive).toMatch(/.*oir$/);
    });

    it('get random verb', async () => {
        async.series([
            function (cb) { 
                request(app).get('/verb?group=er').then(data => { cb(data.body.infinitive) });            
            },
            function (cb) { 
                request(app).get('/verb?group=er').then(data => { cb(data.body.infinitive) });            
            },
            function (cb) { 
                request(app).get('/verb?group=er').then(data => { cb(data.body.infinitive) });            
            }
        ], (results) => {
            const uniqueElems = new Set([...results]);
            expect(uniqueElems.size).toBeGreaterThan(1);
        });
    });
});

describe('get /conjugation', () => {
    test.each`
        infinitive    | tense                       | pronoun | expected
        ${'aller'}    | ${'indicatif présent'}      | ${'je'} | ${'vais'}
        ${'aller'}    | ${'imparfait'}              | ${'je'} | ${'allais'}
        ${'aller'}    | ${'passé simple'}           | ${'je'} | ${'allai'}
        ${'aller'}    | ${'futur simple'}           | ${'je'} | ${'irai'}
        ${'aller'}    | ${'passé composé'}          | ${'je'} | ${'suis allé'}
        ${'aller'}    | ${'plus-que-parfait'}       | ${'je'} | ${'étais allé'}
        ${'aller'}    | ${'futur antérieur'}        | ${'je'} | ${'serai allé'}
        ${'aller'}    | ${'subjonctif présent'}     | ${'je'} | ${'aille'}
        ${'aller'}    | ${'subjonctif passé'}       | ${'je'} | ${'sois allé'}
        ${'aller'}    | ${'conditionnel présent'}   | ${'je'} | ${'irais'}
        ${'aller'}    | ${'conditionnel passé'}     | ${'je'} | ${'serais allé'}
        ${'aller'}    | ${'impératif'}              | ${'tu'} | ${'va'}
    `('returns "$expected" when $infinitive is conjugated in $tense tense with $pronoun as pronoun', 
        async ({infinitive, tense, pronoun, expected}) => {
        const { body } = await request(app).get(
            `/conjugation?tense=${tense}&pronoun=${pronoun}&infinitive=${infinitive}`
        );
        expect(body.conjugation).toEqual(expected);
    });
});
