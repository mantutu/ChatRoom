var express = require('express');
var router = express.Router();

/* GET chat room page */
router.get('/', function(req, res, next) {
  res.render('chat', { title: 'Express' });
});

module.exports = router;
