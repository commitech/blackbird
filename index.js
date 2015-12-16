var express = require('express');
var wagner = require('wagner-core');

require('./db')(wagner);

var app = express();

app.use('/api', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
