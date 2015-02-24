# CEP Scraper

A JavaScript client to [scrape](https://en.wikipedia.org/wiki/Web_scraping) data from [BuscaCEP](http://www.buscacep.correios.com.br/).

## Install

```
$ npm install codigourbano/cep-scraper
```

## Example

Search using a string
```javascript
var CEP = require('cep-scraper');

CEP.scrape('avenida paulista', function(data) {
	console.log(data);
});
```

Query
```javascript
var CEP = require('cep-scraper');
CEP.scrape({
	uf: 'SP',
	localidade: 'São Paulo',
	tipo: 'Avenida',
	logradouro: 'Paulista',
	numero: 1111
}, function(data) {
	console.log(data);
});
```