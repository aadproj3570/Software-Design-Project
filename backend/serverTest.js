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

describe('Server',function(){
    describe("GET /profile", () => {
        it("It should render the profile page with an OK status", (done) => {
            chai.request(server)
                .get("/profile")
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })
    it("It should NOT render the profile page with an OK status", (done) => {
        chai.request(server)
            .get("/notprofile")
            .end((err, response) => {
                response.should.have.status(404);
            done();
            })
    })
    it("It GET the updated client form to the profile", (done) => {
        const user = {
            full_name: 'Tommy Angelo', 
            street1: '5384 Santa Monica Blvd', 
            street2: 'Ste 20',
            state: 'CA',
            city: 'Los Angelos', 
            zip: '90003'
        }
        chai.request(server)
            .get("/profile")
            .send(user)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
            done();
            })
        })
    it("It GET the wrong client form to the profile", (done) => {
        const user = {
            full_name: 'name1', 
            street1: '@street1', 
            street2: 'N/A',
            state: 'GA',
            city: 'city123', 
            zip: '00000'
         }
        chai.request(server)
        .get("/notprofile")
        .send(user)
        .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        done();
        })
    })})