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

describe("POST /login", () => {
    it("It should authenticate login", (done) => {
      const user = {
        username: "darsh",
        password: "beast123",
      };
      chai
        .request(server)
        .post("/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
    it("It should not authenticate login", (done) => {
      const user = {
        username: "tommy",
        password: "angelo123",
      };
      chai
        .request(server)
        .post("/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
  });
  describe("POST /login", () => {
    it("Password DOES exist", (done) => {
      const user = {
        password: "beast123"
      };
      chai
        .request(server)
        .post("/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });
    it("Password DOES NOT exist", (done) => {
      const user = {
        password: "0000"
      };
      chai
        .request(server)
        .post("/login")
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          done();
        });
    });

    describe("GET /login", () => {
      it("Should get the login page with 200 status", (done) => {
          chai.request(server)
              .get("/login")
              .end((err, response) => {
                  response.should.have.status(200);
              done();
              })
      })
  })

    describe("POST /login", () => {
      it("Should process the login credentials with 200 status", (done) => {
          chai.request(server)
              .post("/login")
              .end((err, response) => {
                  response.should.have.status(200);
              done();
              })
      })
  })},);