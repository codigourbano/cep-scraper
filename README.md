# CEP Scraper

A JavaScript client to [scrape](https://en.wikipedia.org/wiki/Web_scraping) data from [BuscaCEP](http://www.buscacep.correios.com.br/).

## Install

```
$ npm install codigourbano/cep-scraper
```

## Example

```javascript
var CEP = require('cep-scraper');

CEP.scrape('avenida paulista', function(data) {
	console.log(data);
});
```