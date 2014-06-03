'use strict';

exports.index = function (req, res) {
  console.log("rendering index.html");
  res.render('index.html')
};