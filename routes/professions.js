module.exports = function(app, models) {
	//Consulta para obtener la profession a partir del nombre
app.get('/professions/:id/:fields/:searchStr/findprofession', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var searchStr = req.params.searchStr;
    var fields = req.params.fields;

    if(fields=='NaN')
    	fields='';

    console.log(searchStr,fields);
    if ( null == searchStr ) {
      res.send(400);
      return;
    }

    models.Professions.findByString(searchStr,fields, function onSearchDone(err,profession) {
      if (err || profession.length == 0) {
        res.send(404);
      } else {
        res.send(profession);
      }
    });
});

//Consulta generica que da como resultado un array de los campos requeridos, apartir de parametros
  app.get('/professions/:where/:fields/:table/resultarray',function (req,res){
    var where=req.params.where;
    var fields = req.params.fields;
    var table = req.params.table;

    if(fields=='NaN')
    	fields='';
    if(where=='NaN')
    	w='';
    else
      w={_id:where};
    if(table=='NaN')
      table='';

    models.Professions.findByArray(w, fields, function(profession) {
      if(w._id){
    	 console.log(profession[0]);
       res.send(profession[0]);
      }else
      {
        console.log(profession);
        res.send(profession)
      }
    });
  });
}