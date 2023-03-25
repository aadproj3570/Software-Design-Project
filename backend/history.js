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

describe("GET /history", () => {
    it("Should get the history page with 200 status", (done) => {
        chai.request(server)
            .get("/history")
            .end((err, response) => {
                response.should.have.status(200);
            done();
            })
    })
})

describe("GET /api/history", () => {
    it("Should get the history page with 200 status", (done) => {
        chai.request(server)
            .get("/api/history")
            .end((err, response) => {
                response.should.have.status(200);
            done();
            })
    })
})