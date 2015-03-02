(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['cheerio', 'request', 'async', 'iconv-lite'], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require('cheerio'), require('request'), require('async'), require('iconv-lite'));
	} else {
		// Browser globals (root is window)
	}

}(this, function($, request, async, iconv) {

	var url = 'http://m.correios.com.br/movel/buscaCepConfirma.do';

	var CEP = {};

	CEP.scrape = function(query, cb) {

		var form;

		if(typeof query == 'string') {
			form = {
				'cepEntrada': query,
				'tipoCep': '',
				'cepTemp': '',
				'metodo': 'buscarCep'
			}
		}

		for(var key in form) {
			if(typeof form[key] == 'string')
				form[key] = removeAccentMark(form[key]).replace(' ', '+');
		}

		var reqSettings = {
			url: url,
			method: 'POST',
			jar: true,
			encoding: null,
			form: form,
			headers: {
				'Host': 'm.correios.com.br',
				'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:36.0) Gecko/20100101 Firefox/36.0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Referer': 'http://m.correios.com.br/movel/buscaCepConfirma.do'
			}
		};

		request(reqSettings, function(err, res, body) {

			if(err) {

				if(typeof cb == 'function')
					cb(err);

			} else {

				var data = parsePage(body);

				var pageNum = data.paging.pageNum;
				var totalItems = data.paging.totalItems;

				reqSettings.form.numPagina = pageNum;
				reqSettings.form.metodo = 'proximo';
				reqSettings.form.regTotal = totalItems;

				if(pageNum*10 < data.paging.totalItems) {

					async.whilst(function() {

						return pageNum*10 <= totalItems || !pageNum;

					}, function(callback) {

						request(reqSettings, function(err, res, body) {

							if(err)

								callback(err);

							else {

								var pagedData = parsePage(body);

								data.paging = pagedData.paging;
								pageNum = data.paging.pageNum;
								reqSettings.form.numPagina = pagedData.paging.pageNum;

								data.data = data.data.concat(pagedData.data || []);

								callback();
							}

						});

					}, function(err) {

						if(err)
							cb(err);
						else {
							delete data.paging;
							cb(data);
						}

					});

				} else {

					delete data.paging;
					cb(data);

				}

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

	function parsePage(body) {

		// decode body
		body = iconv.decode(new Buffer(body), 'iso-8859-1');

		var html = $.load(body);

		var response = {
			data: []
		};

		var data = html('.caixacampobranco,.caixacampoazul');

		data.each(function() {

			var address = $(this).find('.respostadestaque');

			response.data.push({
				'address': 		parseAddress(address.eq(0).text().trim()),
				'district': 	address.eq(1).text().trim(),
				'city': 		address.eq(2).text().trim().split('/')[0].trim(),
				'state': 		address.eq(2).text().trim().split('/')[1].trim(),
				'postcode': 	parsePostcode(address.eq(3).text().trim()),
				'client': 		address.eq(4) ? address.eq(4).text().trim() : null
			});

		});

		// paging
		response.paging = {
			pageNum: parseInt(html('input[name="numPagina"]').val()),
			totalItems: parseInt(html('input[name="regTotal"]').val())
		};

		return response;

	}

	function parseAddress(address) {

		var parsed = {};

		// Exact number
		if(address.indexOf(', ') !== -1 && parseInt(address.split(',')[1].trim())) {
			parsed = {
				'name': address.split(',')[0].trim(),
				'number': parseInt(address.split(',')[1].trim())
			};

		// From start to number
		} else if(address.indexOf(' - até') !== -1) {
			parsed = {
				'name': address.split(' - até')[0].trim(),
				'range': [
					'start',
					address.split('- até')[1].trim().split(' - lado')[0]
				]
			};

		// From number
		} else if(address.indexOf(' - de') !== -1) {

			// From number to number
			if(address.indexOf('ao fim') == -1) {
				parsed = {
					'name': address.split(' - de')[0].trim(),
					'range': [
						address.split(' - de')[1].split(' a ')[0].trim(),
						address.split(' - de')[1].split(' a ')[1].trim().split(' - lado')[0]
					]
				};

			// From number to end
			} else {
				parsed = {
					'name': address.split(' - de')[0].trim(),
					'range': [
						address.split(' - de')[1].split('ao')[0].trim(),
						'end'
					]
				};
			}

		// No address details found
		} else {
			parsed = {
				'name': address
			};
		}

		// Address side (even or odd)
		var side = getAddressSide(address);

		if(side) {
			parsed['side'] = side
		}

		return parsed;

	}

	function getAddressSide(address) {
		if(address.indexOf('lado par') !== -1)
			return 'even';
		else if(address.indexOf('lado ímpar') !== -1)
			return 'odd';
		return false;
	}

	function parsePostcode(postcode) {

		var parsed = [postcode.slice(0, 5), '-', postcode.slice(5)].join('');

		return parsed;

	}

	return CEP;

}));