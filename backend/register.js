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

describe("GET /register", () => {
    it("Should get the register page with 200 status", (done) => {
        chai.request(server)
            .get("/register")
            .end((err, response) => {
                response.should.have.status(200);
            done();
            })
    })
})

describe("POST /register", () => {
    it("It should authenticate registration", (done) => {
        const user = {
          username: "Tommy",
          password: "Angelo",
        };
        chai.request(server)
            .post("/register")
            .end((err, response) => {
                response.should.have.status(200);
            done();
            })
    })
})
describe("POST /register", () => {
    it("Should Post registration info with 200 status", (done) => {
        chai.request(server)
            .post("/register")
            .end((err, response) => {
                response.should.have.status(200);
            done();
            })
    })
})

describe("GET /logout", () => {
    it("It should logout with an OK status", (done) => {
        chai.request(server)
            .get("/logout")
            .end((err, response) => {
                response.body.should.be.a('object');
                response.should.have.status(200);
            done();
            })
    })

    it("It did not logout with an OK status", (done) => {
        chai.request(server)
            .get("/logoutt")
            .end((err, response) => {
                response.body.should.be.a('object');
                response.should.have.status(404);
            done();
            })
    })
})

    describe("GET /", () => {
        it("Should get the home page with 200 status", (done) => {
            chai.request(server)
                .get("/")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    describe("/logout to delete ", () => {
        it("Should get the login page with 200 status", (done) => {
            chai.request(server)
                .delete("/logout")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })