const cheerio = require('cheerio');
const termList = require('./terms.js');
const fs = require('fs');
const request = require('request');

let scrapedObject = {};



termList.terms.forEach((term)=>{
  request('https://www.wikipedia.org/wiki/' + term, (err, res, body)=>{
    if (err) throw err;

    if (term.includes('_')){
      term = term.replace(/_/g, ' ');
    };

    if (term.includes('(')){
      term = term.replace(/\(.*\)/,"");
    };

    $ = cheerio.load(body);
    //console.log($('div.mw-parser-output > p').first().html())
    let definition = $('div.mw-parser-output > p').first().text();

    if (definition.includes('[')){
      definition = definition.replace(/\[.*\]/g,"");
    };

     scrapedObject[term] = definition;
     
    if (Object.keys(scrapedObject).length == termList.terms.length){
      fs.appendFile('results.json', JSON.stringify(scrapedObject,null,'\t'), (err)=>{
      console.log('appended file');
    })
    }
  });
});





//loop over terms.js
//use request to poll wikipedia page
//use cheerio.load to init token
//use .first to grab first <p> tag after the header
//store data into a array of objects
