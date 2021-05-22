const { expect } = require('@jest/globals');
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

