(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['cheerio', 'request', 'iconv-lite'], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('cheerio'), require('request'), require('iconv-lite'));
	} else {
		// Browser globals (root is window)
	}

}(this, function($, request, iconv) {

	var urls = {
		search: 'http://www.buscacep.correios.com.br/servicos/dnec/consultaEnderecoAction.do',
		query: 'http://www.buscacep.correios.com.br/servicos/dnec/consultaLogradouroAction.do'
	};

	var CEP = {};

	CEP.scrape = function(query, cb) {

		var url, form;

		if(typeof query == 'string') {
			url = urls.search;
			form = {
				'relaxation': query,
				'TipoCel': 'ALL',
				'semelhante': 'N',
				'cfm': 1,
				'Metodo': 'listaLogradouro',
				'TipoConsulta': 'relaxation'
			}
		} else {
			url = urls.query;
			form = {
				'UF': query.uf || '',
				'Localidade': query.localidade || '',
				'Tipo': query.tipo || '',
				'Logradouro': query.logradouro || '',
				'Numero': query.numero || '',
				'cfm': 1,
				'Metodo': 'listaLogradouro',
				'TipoConsulta': 'logradouro'
			};
		}

		for(var key in form) {
			if(typeof form[key] == 'string')
				form[key] = removeAccentMark(form[key]).replace(' ', '+');
		}

		request({
			url: url,
			method: 'POST',
			encoding: null,
			form: form
		}, function(err, res, body) {

			if(err) {

				if(typeof cb == 'function')
					cb(err);

			} else {

				cb(parse(body));

			}

		});
	};

	function removeAccentMark(str) {

		var map = {
			a : /[\xE0-\xE6]/g,
			A : /[\xC0-\xC6]/g,
			e : /[\xE8-\xEB]/g,
			E : /[\xC8-\xCB]/g,
			i : /[\xEC-\xEF]/g,
			I : /[\xCC-\xCF]/g,
			o : /[\xF2-\xF6]/g,
			O : /[\xD2-\xD6]/g,
			u : /[\xF9-\xFC]/g,
			U : /[\xD9-\xDC]/g,
			c : /\xE7/g,
			C : /\xC7/g,
			n : /\xF1/g,
			N : /\xD1/g,
		};

		for(var l in map ) {
			var exp = map[l];
			str = str.replace(exp, l);
		}

		return str;
	}

	function parse(body) {

		// decode body
		body = iconv.decode(new Buffer(body), 'iso-8859-1');

		var html = $.load(body);

		if(html('.ctrlcontent title').text() == 'Erro') {
			return {'error': html('.ctrlcontent font:first-child').text()};
		}

		var dataTable = html('.ctrlcontent div > table:first-child');

		var response = {
			data: []
		};

		dataTable.find('tr').each(function() {

			var item = $(this);

			response.data.push({
				'logradouro': item.find('td:nth-child(1)').text(),
				'bairro': item.find('td:nth-child(2)').text(),
				'localidade': item.find('td:nth-child(3)').text(),
				'uf': item.find('td:nth-child(4)').text(),
				'cep': item.find('td:nth-child(5)').text()
			});

		});

		return response;

	}

	return CEP;

}));