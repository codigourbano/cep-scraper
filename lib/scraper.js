(function () {

	var url = 'http://www.buscacep.correios.com.br/servicos/dnec/consultaEnderecoAction.do';

	var $ = require('cheerio'),
		_ = require('underscore'),
		request = require('request')
		iconv = require('iconv');

	var CEP = {};

	CEP.scrape = function(search, cb) {
		request({
			url: url,
			method: 'POST',
			encoding: 'binary',
			form: {
				relaxation: search.replace(' ', '+').toLowerCase(),
				TipoCel: 'ALL',
				semelhante: 'N',
				cfm: 1,
				Metodo: 'listaLogradouro',
				TipoConsulta: 'relaxation'
			}
		}, function(err, res, body) {

			if(err) {

				if(typeof cb == 'function')
					cb(err);

			} else {

				cb(parse(body));

			}

		});
	};

	function parse(body) {

		// convert to UTF-8
		var ic = new iconv.Iconv('iso-8859-1', 'UTF-8');
		body = ic.convert(new Buffer(body, 'binary')).toString('utf-8');

		var results = [];

		var html = $.load(body);
		var dataTable = html('.ctrlcontent div > table:first-child');

		dataTable.find('tr').each(function() {

			var item = $(this);

			results.push({
				'logradouro': item.find('td:nth-child(1)').text(),
				'bairro': item.find('td:nth-child(2)').text(),
				'localidade': item.find('td:nth-child(3)').text(),
				'uf': item.find('td:nth-child(4)').text(),
				'cep': item.find('td:nth-child(5)').text()
			});

		});

		return results;

	}

	// Node.js
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CEP;
	}
	// AMD / RequireJS
	else if (typeof define !== 'undefined' && define.amd) {
		define([], function () {
		return CEP;
	});
	}
	// included directly via <script> tag
	else {
		root.CEP = CEP;
	}

}());