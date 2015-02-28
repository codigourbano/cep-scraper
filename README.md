# CEP Scraper

A JavaScript client to [scrape](https://en.wikipedia.org/wiki/Web_scraping) data from [BuscaCEP](http://www.buscacep.correios.com.br/).

## Install

Inside your application directory:
```
$ npm install cep-scraper --save
```

## Example

**Search using a string**

```javascript
var CEP = require('cep-scraper');

CEP.scrape('avenida paulista', function(res) {
	console.log(res.data);
});
```

**Get address from postcode**

```javascript
var CEP = require('cep-scraper');

CEP.scrape('01310-000', function(res) {
	console.log(res.data);
});
```

**Query**

```javascript
var CEP = require('cep-scraper');

CEP.scrape({
	uf: 'SP',
	localidade: 'São Paulo',
	tipo: 'Avenida',
	logradouro: 'Paulista',
	numero: 1111
}, function(res) {
	console.log(res.data);
});
```