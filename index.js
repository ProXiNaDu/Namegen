const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use('/public', express.static('public'));


function generate(options) {
  let name = options.pattern,
      oldName,
      symReg,
      match;

  for (let i in options) {
    if ( i === 'pattern' ) {
      continue;
    }

    symReg = new RegExp(`(\\$(\\d*)${i})`);

    do {
      oldName = name;

      if ( match = name.match(symReg) ){
        match = (match[2] === '') ? 100 : +match[2];
        if ( Math.floor(Math.random()*100) < match ) {
          name = name.replace(symReg, options[i][Math.floor(Math.random()*options[i].length)]);
        } else {
          name = name.replace(symReg, '');
        }
      }
    } while ( oldName != name );
  }

  return name;
}

app.get('/', (req, res)=>{
	res.sendFile(`${__dirname}/index.html`);
});
app.get('/favicon.ico', (req, res)=>{
  res.sendFile(`${__dirname}/favicon.ico`);
});

app.post('/init', (req, res)=>{
  fs.readFile(`${__dirname}/public/names/names.json`, 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
app.post('/generate', urlencodedParser, (req, res)=>{
  res.send( generate( JSON.parse(req.body.options) ) );
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));