const assert = require('chai').assert;
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server');
chai.should();
chai.use(chaiHttp);

checkHistResult = app.checkHist();
checkHist0Result = app.checkHist()[0];
checkHist1Result = app.checkHist()[1];
checkHist2Result = app.checkHist()[2];

checkNameResult = app.user().full_name;
checkStreet1Result = app.user().street1;
checkStreet2Result = app.user().street2;
checkStateResult = app.user().state;
checkCityResult = app.user().city;
checkZipResult = app.user().zip;
server = app.server;

describe("GET /editProfile", () => {
    it("It should render the editProfile page with an OK status", (done) => {
        chai.request(server)
            .get("/editProfile")
            .end((err, response) => {
                response.body.should.be.a('object');
                response.should.have.status(200);
            done();
            })
    })

    it("It should not render the editProfile page with an OK status", (done) => {
        chai.request(server)
            .get("/editProfiles")
            .end((err, response) => {
                response.body.should.be.a('object');
                response.should.have.status(404);
            done();
            })
    })
})

describe("POST /editProfile", () => {
    it("It POST the user credentials to the server", (done) => {
        const user = {
            full_name: 'Min Shwe Maung Htet', 
            street1: '1234 Houston Street', 
            street2: 'Apt 1234',
            state: 'TX',
            city: 'Houston', 
            zip: '77002'
        }
        chai.request(server)
            .post("/editProfile")
            .send(user)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
            done();
            })
    })

    it("It POST the wrong user credentials to the server", (done) => {
        const user = {
            full_name: 'None', 
            street1: '00 Test St', 
            street2: ' ',
            state: 'KK',
            city: 'none', 
            zip: '0'
        }
        chai.request(server)
            .post("/editProfile")
            .send(user)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
            done();
            })
    })
})