const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({origin: true});

var fs = require('fs');
var formatCSV = '';
var testArr = [
  [0.018317, -0.019618, -0.011231, 0.999577],
  [0.018395, -0.019801, -0.011154, 0.999573],
  [0.018559, -0.019742, -0.01115, 0.999571]
];

// 配列をcsvで保存するfunction
function exportCSV(content){
  for(var i = 0; i < content.length; i++) {
      var value = content[i];

      for (var j = 0; j < value.length; j++) { var innerValue = value[j]===null?'':value[j].toString(); var result = innerValue.replace(/"/g, '""'); if (result.search(/("|,|\n)/g) >= 0)
      result = '"' + result + '"';
      if (j > 0)
      formatCSV += ',';
      formatCSV += result;
    }
    formatCSV += '\n';
  }
  fs.writeFile('formList.csv', formatCSV, 'utf8', function (err) {
    if(err){
      console.log('保存できませんでした');
    }else{
      console.log('保存できました');
    }
  });
}

exports.exportCSV = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log('body', req.body);


    exportCSV(testArr);


    res.status(200).send({result: 'Hello'});
  }); // cors
});