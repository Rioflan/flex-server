
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
chai.should();

/**
 * Test the /GET api route
 */
  describe('/GET /api', () => {
      it('It works ! Server is running', (done) => {
        chai.request('http://localhost:3000')
            .get('/api')
            .end((err, res) => {
                  res.should.have.status(200);
                  chai.expect(res.text).to.eql('{"message":"It works !"}');
              done();
            });
      });
  });
/**
 * Test the /POST /api/register
 */

 var api_token = "";
 let domainName = "test.com";
 let user = "user_"+Math.floor(Math.random() * 600) + 1;
 let userMail = user +"@"+domainName;

  describe('/POST /api/register', () => {
    it('You can register and get a token', (done) => {


      chai.request('http://localhost:3000')
          .post('/api/register')
          .send({"email": userMail, "name": "Mocha", "password":"azerty"})
          .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                api_token = res.body.token;
            done();
          });
    });
  });

  /**
   * Test the /POST /api/login
   */
  var user_token = "";

  describe('/POST /api/login', () => {
    it('You can login with the api token', (done) => {

      chai.request('http://localhost:3000')
          .post('/api/login')
          .set('authorization',api_token)
          .send({"email": userMail, "password":"azerty"})
          .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                user_token = res.body.token;
            done();
          });
    });
  });

  /**
   * Test the /POST /api/user/login  -> FAILED
   */
/*
  describe('/POST /api/user/login', () => {
    it('You can login with the api token', (done) => {

      chai.request('http://localhost:3000')
          .post('/api/login')
          .set('authorization',"")
          .send({"email": userMail})
          .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('email');
            done();
          });
    });
  });
*/
  /**
   * Test the /POST /api/user/login
   */
  
  describe('/POST /api/user/login', () => {
    it('You can login with the user token', (done) => {

      chai.request('http://localhost:3000')
          .post('/api/user/login')
          .set('authorization',user_token)
          .send({"email": userMail})
          .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('email');
                res.body.email.should.equal(userMail);
            done();
          });
    });
  });

  /**
   * Test the /GET /api/me
   */
  describe('/POST /api/me', () => {
    it('You retrieve your identity with a user token', (done) => {

      chai.request('http://localhost:3000')
          .get('/api/me')
          .set('authorization',user_token)
          .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('email');
                res.body.email.should.equal(userMail);
            done();
          });
    });
  });

    /**
   * Test the /GET /api/me
   */
  describe('/POST /api/logout', () => {
    it('You log out', (done) => {

      chai.request('http://localhost:3000')
          .get('/api/logout')
          .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.auth.should.equal(false);
                chai.expect(res.body.token).to.be.null;
            done();
          });
    });
  });
