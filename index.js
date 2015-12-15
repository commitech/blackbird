var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);

var app = express();

app.listen(3000);
console.log('Listening on port 3000!');
