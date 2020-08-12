const request = require('supertest');

const rep = require('../../../src/server/db/repository');
const {app} = require('../../../src/server/app');

/*
INSPIRED BY AND OTHERS THROUGHOUT REPO
https://github.com/arcuri82/web_development_and_api_design/blob/master/les07/server_client_together/tests/server/app-test.js
 */

beforeEach(() => {rep.initItems();});

test("Test get all", async () =>{

    const response = await request(app).get('/api/items');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(6);
});


test("Test not found item", async () => {

    const response = await request(app).get('/api/items/-3');
    expect(response.statusCode).toBe(404);
});


test("Test retrieve each single item", async () => {

    const responseAll = await request(app).get('/api/items');
    expect(responseAll.statusCode).toBe(200);

    const items = responseAll.body;
    expect(items.length).toBe(6);

    for(let i=0; i<items.length; i++){

        const res = await request(app).get('/api/items/'+items[i].id);
        const item = res.body;

        expect(item.name).toBe(items[i].name)
    }
});


test("Test create item", async () => {

    let responseAll = await request(app).get('/api/items');
    const n = responseAll.body.length;

    const title = "foo";

    const resPost = await request(app)
        .post('/api/items')
        .send({name:title, description:"bar", currentBid: 2018})
        .set('Content-Type', 'application/json');

    expect(resPost.statusCode).toBe(201);
    const location = resPost.header.location;

    responseAll = await request(app).get('/api/items');
    expect(responseAll.body.length).toBe(n + 1);

    const resGet = await request(app).get(location);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.name).toBe(title);
});


test("Delete all items", async () =>{

    let responseAll = await request(app).get('/api/items');
    expect(responseAll.statusCode).toBe(200);

    const items = responseAll.body;
    expect(items.length).toBe(6);

    for(let i=0; i<items.length; i++){

        const res = await request(app).delete('/api/items/'+items[i].id);
        expect(res.statusCode).toBe(204);
    }

    responseAll = await request(app).get('/api/items');
    expect(responseAll.statusCode).toBe(200);
    expect(responseAll.body.length).toBe(0);
});


test("Update item", async () => {

    const title = "test";

    const resPost = await request(app)
        .post('/api/items')
        .send({name:title, description:"tester", currentBid: 1234})
        .set('Content-Type', 'application/json');
    expect(resPost.statusCode).toBe(201);
    const location = resPost.header.location;

    let resGet = await request(app).get(location);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.name).toBe(title);

    const modified = "tester";
    const id = location.substring(location.lastIndexOf("/")+1, location.length);

    const resPut = await request(app)
        .put(location)
        .send({id:id, name:modified, description:"tester", currentBid: 1234})
        .set('Content-Type', 'application/json');
    expect(resPut.statusCode).toBe(204);

    resGet = await request(app).get(location);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.name).toBe(modified);
});
