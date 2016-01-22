var express = require('express');
var router = express.Router();
var textdiff = require('../helpers/textdiff');

router.post('/', function(req, res, next) {
  var diff = textdiff.textCompare(req.body.textA, req.body.textB);
  
  res.send('You sent me: \n' + req.body.textA + '\n--------\n' + req.body.textB + '\n\nResult: \n\n' + diff + "\n\n");
});

module.exports = router;
