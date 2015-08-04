# CEP Scraper

[![Build Status](https://travis-ci.org/codigourbano/cep-scraper.svg)](https://travis-ci.org/codigourbano/cep-scraper)
[![Coverage Status](https://coveralls.io/repos/codigourbano/cep-scraper/badge.svg)](https://coveralls.io/r/codigourbano/cep-scraper)
[![bitHound Score](https://www.bithound.io/github/codigourbano/cep-scraper/badges/score.svg?)](https://www.bithound.io/github/codigourbano/cep-scraper/master)
[![Dependency Status](https://david-dm.org/codigourbano/cep-scraper.svg "Dependencies Checked & Updated Regularly (Security is Important!)")](https://david-dm.org/codigourbano/cep-scraper)

A JavaScript client to [scrape](https://en.wikipedia.org/wiki/Web_scraping) data from [BuscaCEP](http://www.buscacep.correios.com.br/).

> **[Lei Postal](http://www.planalto.gov.br/ccivil_03/leis/L6538.htm) Art. 15 § 3º**

> É facultada a edição de lista de
> endereçamento postal sem finalidade
> comercial e de distribuição gratuita,
> conforme disposto em regulamento.

## Install

Inside your application directory:
```
$ npm install cep-scraper --save
```

## Examples

### Get address from postcode

#### Code

```javascript
var CEP = require('cep-scraper');

CEP.scrape('01310-000', function(res) {
  console.log(res.data);
});
```

#### Output

```json
{
  "data": [
    {
      "address": {
        "name": "Avenida Paulista",
        "range": [
          "start",
          "610"
        ],
        "side": "even"
      },
      "district": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "postcode": "01310-000",
      "client": ""
    }
  ]
}
```

### Search using a string

#### Code

```javascript
var CEP = require('cep-scraper');

CEP.scrape('avenida paulista 1111', function(res) {
  console.log(res.data);
});
```

#### Output

```json
{
  "data": [
    {
      "address": {
        "name": "Avenida Paulista",
        "number": 1111
      },
      "district": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "postcode": "01311-920",
      "client": "Citibank S.A."
    }
  ]
}
```

# Contributing

1. Clone locally
1. `npm install`
1. Write code
1. `npm test`
1. Pull request.

Mantainers can update [coveralls.io](https://coveralls.io/github/codigourbano/cep-scraper) with an API key and running `./coveralls`. 
