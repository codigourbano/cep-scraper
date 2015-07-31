var module = require('../index'),
    should = require('should'),
    CEP = require('../index');

describe('#init', function() {
    it('should execute the first test :)', function(done) {
        done();
    });
});

describe('Address from Postcode', function() {
    it('should get an address from a postcode', function(done) {

        CEP.scrape('01310-000', function(res) {
            should(res).be.ok;
            should(res.data).be.an.Array();
            should(res.data).not.be.empty();

            var result = res.data[0];

            should(result.state).be.a.String();
            should.equal(result.state, "SP", "State not equal as expected");

            should.equal(result.address.name, "Avenida Paulista", "State not equal as expected");

            done();
        });

    });
});
