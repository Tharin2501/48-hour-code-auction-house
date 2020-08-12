/*
INSPIRED BY: https://github.com/arcuri82/web_development_and_api_design/blob/master/les07/server_client_together/tests/client/home-test.jsx

 */

import {SignUp} from "../../src/client/components/signup";
import {Item} from "../../src/client/components/Item";
import {Create} from "../../src/client/components/create";
import {Edit} from "../../src/client/components/edit";

const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter, Route, Switch, Redirect} = require('react-router-dom');
const {Home} = require("../../src/client/components/home");
const {HeaderBar} = require("../../src/client/components/headerbar");
const {Login} = require("../../src/client/components/login");
const {stubFetch, flushPromises, overrideFetch, asyncCheckCondition} = require('../mytest-utils');

const {app} = require('../../src/server/app');
const {resetAllUsers} = require('../../src/server/db/users');
const {setUpDomEnvironment} = require('../jest-setup');

beforeEach(() => {
    resetAllUsers();
});


async function signup(userId, password) {

    const response = await fetch('/api/signup', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: userId, password: password})
        }
    );

    return response.status === 201;
}

function displayedItems(driver) {

    const quiz = driver.find('.allItems');
    const questions = driver.find('.singleItem');

    return quiz && questions;
}

async function waitForQuizDisplayed(driver) {

    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return displayedItems(driver);
    }, 2000, 200);

    return displayed;
}


test("Test render items", async () => {

    overrideFetch(app);

    const signedup = await signup("foo", "bar");
    expect(signedup).toEqual(true);

    const driver = mount(<Home/>);

    const displayed = await waitForQuizDisplayed(driver);

    expect(displayed).toEqual(true);


});

test("Test display item using stub", async () => {

    const title = "The One Ring";

    stubFetch(
        200,
        [{id: 0, name: title, currentBid: 999666, description: "One ring to rule them all"}],
        (url) => url.endsWith("/api/items")
    );

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Home/>
        </MemoryRouter>
    );

    await flushPromises();

    const html = driver.html();

    expect(html).toMatch(title);
});

let server;
let port;

beforeAll(done => {

    server = app.listen(0, () => {
        port = server.address().port;
        setUpDomEnvironment('http://localhost:' + port + "/");
        done();
    });
});

afterAll(done => {
    server && server.close(done);
});

test("Test render different components with routing", () => {

    const driver = mount(
        <MemoryRouter>
            <Route component={Login}/>
            <Route component={SignUp}/>
            <Route component={HeaderBar}/>
            <Route component={Item}/>
            <Route component={Create}/>
            <Route component={Edit}/>
        </MemoryRouter>
    );
    const findLoginForm = driver.find('#center').hostNodes();
    const findSignupForm = driver.find('#center').hostNodes();
    const findHomeLink = driver.find('#header-logo').hostNodes();

    expect(findLoginForm).toBeDefined();
    expect(findSignupForm).toBeDefined();
    expect(findHomeLink).toBeDefined();
});

