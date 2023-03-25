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

describe('Server', function() {
    describe("GET /fuel_quote", () => {
        it("It should render the fuel_quote page with an OK status", (done) => {
            chai.request(server)
                .get("/fuel_quote")
                .end((err, response) => {
                    response.body.should.be.a('object');
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("POST /fuel_quote", () => {
        it("It should POST the fuel quote values to the server OK status", (done) => {
            chai.request(server)
                .post("/fuel_quote")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a('object');
                done();
                })
        })
        it("It should authenticate fuel quote form is valid", (done) => {
            const user = {
                gallons: "4200",
                date: "03/16/2023",
            };
            chai
            .request(server)
            .post("/fuel_quote")
            .send(user)
            .end((err, response) => {
                response.should.have.status(200);
                done();
            });
        })

        it("It should autenticate fuel quote form is invalid", (done) => {
            const user = {
                gallons: "-5",
                date: "nodate",
            };
            chai
            .request(server)
            .post("/fuel_quote")
            .send(user)
            .end((err, response) => {
                response.should.have.status(404);
                done();
            });
        });
    })
})