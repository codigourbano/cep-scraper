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


describe('Search address from a string', function() {
    it('should search an address using a string', function(done) {

        CEP.scrape('avenida paulista 1111', function(res) {
            should(res).be.ok;
            should(res.data).be.an.Array();
            should(res.data).not.be.empty();

            var result = res.data[0];

            should(result.state).be.a.String();
            should.equal(result.state, "SP", "State not equal as expected");
            should.equal(result.postcode, "01311-920", "Postcode not equal as expected");

            should.equal(result.address.name, "Avenida Paulista", "State not equal as expected");
            should.equal(result.address.number, 1111, "Number is not equal as expected");

            done();
        });

    });
});
