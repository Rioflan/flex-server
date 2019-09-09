
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
chai.should();

/*
  * Test the /GET api route
  */
  describe('/GET api', () => {
      it('it should say it works', (done) => {
        chai.request('http://localhost:3000')
            .get('/api')
            .end((err, res) => {
                  console.group(res.body);
                  res.should.have.status(200);
                  chai.expect(res.text).to.eql('{"message":"It works !"}');
              done();
            });
      });
  });