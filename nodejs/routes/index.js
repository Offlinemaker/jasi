var express = require('express');
var router = express.Router();


var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'query_jasec',
  password : 'letmesearch',
  database : 'jasec'
});
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.send('Hello World!');
  res.render('index', { title: 'Express' , name: 'Greg'});
});

router.get('/search',function(req, res, next) {
  var sterm = req.query.term;
  var codes = [];
  var FGR;
  var FG;
  var R;
  var stellen=0;
  for (var i = 0; i < sterm.length; i++) {
    var act = parseInt(sterm.charAt(i));
    if(act>=0 && act <= 9 && act != 1){
      FGR=act;
      i++;
      act = parseInt(sterm.charAt(i));
      i++;
      var actp = parseInt(sterm.charAt(i));
      if(act >=0 && act <=9 && actp >=0 && actp <=9){
        FG=act*10+actp;
        i++;
        act = parseInt(sterm.charAt(i));
        i++;
        actp = parseInt(sterm.charAt(i));
        if(act >=0 && act <=9 && actp >=0 && actp <=9){
          R=act*10+actp;
          var zeichen = {fgr: FGR, fg: FG, r: R};
          codes.push(zeichen);
          stellen++;
          }
        else{
          res.send("FAIL");
          }

        }
      else{
        res.send("FAIL");
        }

      }
    else{
      res.send("FAIL");
      }
    }
  var customquery = "select * from wort where ";
  for (var i=0;i<stellen;i++){
    var stelle = i+1;
    if(stelle > 1){
      customquery=customquery+" AND ";
      }
    customquery=customquery+"wortid=any(select wortid from woerterbuch where fgr="+codes[i].fgr+" AND fg="+codes[i].fg+" AND rg="+codes[i].r+" AND stelle="+stelle+")";
    }
  customquery=customquery+";";
  console.log(customquery);

  var resulttable='<table><tr><th>Lesung</th><th>Bedeutung</th></tr>';
  var resrows = [];
  connection.query(customquery, function(err, rows, fields) {
  rows.forEach(function(row) {
    resulttable+='<tr><th>'+row.lesung+'</th><th>'+row.bedeutung+'</th></tr>';
    resrows.push(row);
  });
  resulttable+='</table>';
  console.log(resulttable);
  res.render('search', { title: 'Search' , term:codes, query:customquery, results:resrows, table:resulttable});

}); 
  //console.log('The solution is: ', rows);
  /*var resquery = connection.query(customquery);
  resquery.on('result', function(rows){
    var resi=processResults(rows);
    console.log('The (res)solution is: ', rows);
    res.render('search', { title: 'Search' , term:codes, query:customquery, results:rows});
  }).on('end',function(rows){console.log('The (end)solution is: ', rows);});*/
  //console.log('The Response is:',response);
  //res.render('search', { title: 'Search' , term:codes, query:customquery, results:response});
  console.log("Sending this table:",resulttable);
  //res.render('search', { title: 'Search' , term:codes, query:customquery, results:resrows, table:resulttable});
});

function processResults(rows){
var resulttable="<table><tr><th>Lesung</th><th>Bedeutung</th></tr>";
    for (row in rows){
     resulttable+="<tr><th>"+row.lesung+"</th><th>"+row.bedeutung+"</th></tr>";
    }
    resulttable+="</table>";
    console.log(resulttable);
  return resulttable;
}
module.exports = router;
