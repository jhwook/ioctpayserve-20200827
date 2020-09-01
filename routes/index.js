var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({status:'ERR',message:'Not-found'});return false
//  res.render('error');
//  res.render('index', { title: 'Express' });
});

module.exports = router;
