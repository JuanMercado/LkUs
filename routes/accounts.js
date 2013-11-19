module.exports = function(app, models) {
  app.get('/accounts/:id/accountid',function(req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    res.send(accountId);
  });

  app.get('/accounts/:id/contacts', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account.contacts);
    });
  });

  app.get('/accounts/:id/invitations', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account.invitations);
    });
  });


  app.get('/accounts/:id/:fields/:searchStr/findmycontacts', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var searchStr = req.params.searchStr;
    var fields = req.params.fields;

    console.log(searchStr,fields);
    if ( null == searchStr ) {
      res.send(400);
      return;
    }

    models.Account.findByString(searchStr,fields, function onSearchDone(err,accounts) {
      if (err || accounts.length == 0) {
        res.send(404);
      } else {
        console.log(accounts);
        res.send(accounts);
      }
    });
});

  app.get('/accounts/:id/getinfoheader', function (req, res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    models.Account.getObjectByIdWithFields(accountId,'accounttype name photoUrlSmall photoUrlLarge professions', function(account) {
      res.send(account);
    });
  });

  app.get('/accounts/:id/posts', function(req,res){
    //console.log('Obtener Posts');
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account.post);
    });
  });

  app.get('/accounts/:id/addresses', function(req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    models.Account.findById(accountId, function(account) {

    if(account.profile.length>0){
        if(account.profile[0].addresses.length>0)
            {
              console.log(account.profile[0].addresses);
              res.send(account.profile[0].addresses);
            }
        else
          {
            res.send(200);
          }
    }else
      res.send(200);
    });
  });

  app.get('/accounts/:id/telephones', function(req,res){
    //console.log('Entre al get telephone');
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    models.Account.findById(accountId, function(account) {
      res.send(account.profile[0].telephones);
    });
  });

  app.get('/accounts/:id/displayname',function(req,res){
    //console.log('Obtengo el nombre');
    var accountId = req.params.id == 'me'
                      ? req.session.accountId
                      : req.params.id;
    var where = req.param('where','');
    var parameters = req.param('parameters','');
    var fields = req.param('fields','');
    models.Account.findById(accountId, function(account){
      res.send(account.name);
    });
  });

  app.get('/accounts/:id/contmenu', function (req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    var where = req.param('where','');
    where['_id']=accountId;
    var firstArray = req.param('firstarray','');
    var secondArray = req.param('secondarray','');
    var fields = req.param('fields','');
    var total=0;
    models.Account.findByArray(where, fields, function(account) {
        //total=account[0][firstArray].length;
        var array = {
          total:total
        }
        res.send(array);
    });

  });
  //Consulta generica que da como resultado un array de los campos requeridos, apartir de parametros
  app.get('/accounts/:id/:where/:fields/:table/resultarray',function (req,res){

    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var where=req.params.where;
    var fields = req.params.fields;
    var table = req.params.table;
    if(where['_id'])
      where['_id']=accountId;
    if(table=='NaN')
      table='';
    console.log(where+'-'+fields+'-'+table+'-');
    models.Account.findByArray(where, fields, function(account) {
      console.log(account[0][table]);
      if(table!='')
        res.send(account[0][table]);
      else
        res.send(account[0]);
    });
  });

  app.post('/accounts/:id/savearraywithtwoarrays', function (req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var where = req.param('where','');
    var firstArray = req.param('firstarray','');
    var secondArray = req.param('secondarray','');
    var parameter = req.param('parameter','');
    var parameters = req.param('parameters','');
    var fields = req.param('fields','');

    models.Account.findByArray(where, fields, function(account) {
      if(account[0][firstArray].length>0){
        account[0][firstArray][0][secondArray].push(parameter);
        account[0].save(function(err){
            app.triggerEvent('event:' + accountId, {
                        from: accountId,
                        data: parameter,
                        action: 'addresschange'
                      });
        });
      }else
      {
        account[0][firstArray].push(parameters);
        account[0].save(function(err){
          app.triggerEvent('event:' + accountId, {
                        from: accountId,
                        data: parameter,
                        action: 'addresschange'
                      });
        });
      }
      });
  });

app.post('/accounts/:id/savemyprofession', function (req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var where = req.param('where','');
    var collection = req.param('collection','');
    var parameter = req.param('parameter','');

    var fields = req.param('fields','');

    models.Account.findByArray(where, fields, function(account) {
        if(account[0].accounttype=="Normal")
          account[0].accounttype="Profesional";

        console.log(account[0][collection]);
        account[0][collection].push(parameter);
        account[0].save(function(err){
        });

      });
  });

  app.post('/accounts/:id/posts',function(req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    models.Account.findById(accountId, function(account) {
      post = {
          accountId: accountId,
          description: req.param('description', ''),
          added: new Date()
      };
      account.post.push(post);
      var ids=account.post[account.post.length-1].id;
      for(var i=0;i<account.post.length; i++){
        if(account.post[i]._id==ids){
          account.post[i]['postId']=account.post[i]._id;
          post['postId']=ids;
          break;
        }
      }
      //Push the status to all friends
      account.save(function (err,model) {
            //Se guarda en todos los seguidores.
            if(account.contacts.length>0){
              for(var i=0; i<account.contacts.length;i++){
                var contactId= account.contacts[i].accountId;
                models.Account.findById(contactId, function(contact){
                contact.post.push(post);
                contact.save(function(err,model){
                  if (err) {
                    console.log('Error saving post: ' + err);
                  }
                  else {
                    if(accountId!=contactId){
                      app.triggerEvent('event:' + contactId, {
                        from: contactId,
                        data: post,
                        action: 'post'
                      });
                    }
                  }
                });
                });
              }
            }
            /////////////////////
      //Aqui se guarda el post en la persona que lo posteo
      if (err) {
        console.log('Error saving post: ' + err);
      } else {
        app.triggerEvent('event:' + accountId, {
          from: accountId,
          data: post,
          action: 'post'
        });
      }
    });
  });
res.send(200);
});

  app.delete('/accounts/:id/contact', function(req,res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    var contactId = req.param('contactId', null);

    // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }
    models.Account.findById(accountId, function(account) {
      if ( !account ) return;
      models.Account.findById(contactId, function(contact,err) {
        if ( !contact ) return;

        models.Account.removeContact(account, contactId);
        // Kill the reverse link
        models.Account.removeContact(contact, accountId);
      });
    });
    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  app.post('/accounts/:id/contact', function(req,res) {
    var acountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    var contactId = req.param('contactId', null);

    // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }

    models.Account.findById(acountId, function(account) {
        models.Account.findById(contactId, function(contact) {
            models.Account.addContact(account, contactId);
            // Make the reverse link
            models.Account.addContact(contact,acountId);
            // Delete from invitation
            models.Account.removeInvitation(account,contactId);
            //
            models.Account.removeInvitation(contact,acountId);
            account.save();
              app.triggerEvent('event:' + contactId, {
                from: contactId,
                data: 1,
                action: 'newinvitation'
              });
              app.triggerEvent('event:' + acountId, {
                from: acountId,
                data: 1,
                action: 'newinvitation'
              });
        });
        app.triggerEvent('event:' + contactId, {
                from: contactId,
                data: 1,
                action: 'newcontact'
        });
      app.triggerEvent('event:'+acountId,{
                from:acountId,
                data:1,
                action:'newcontact'
              });
      });
    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  app.post('/accounts/:id/sendinvitation',function(req,res){
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var contactId = req.param('contactId', null);

    // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }
    var newInvitationToMyNewFriend ={
     contactId : contactId,
     statusmine: 'Pendiente',
     statusfollower :'Aceptar',
     added: new Date()
    };
    var newInvitationFromMe = {
      contactId : accountId,
      statusmine: 'Aceptar',
      statusfollower :'Pendiente',
      added: new Date()
    };

    models.Account.findById(accountId, function(account){
      account.invitations.push(newInvitationToMyNewFriend);
      account.save(function (err,model){
          models.Account.findById(contactId, function(contact) {
          contact.invitations.push(newInvitationFromMe);
          contact.save(function (err,model){
            if(err){
              console.log('Error al invitar');
            }else{
              //Notificar al usuario.
              app.triggerEvent('event:' + contactId, {
                from: contactId,
                data: newInvitationFromMe,
                action: 'newinvitation'
              });
            }
          });

          if(err){
            console.log(err);
          }else{
            //Notificarme
            app.triggerEvent('event:'+accountId,{
              from:accountId,
              data:newInvitationToMyNewFriend,
              action:'newinvitation'
            });
          }
        });
    });
  });
    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
res.send(200);
});

app.delete('/accounts/:id/removeinvitation', function(req,res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    var contactId = req.param('contactId', null);

    // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }
    models.Account.findById(accountId, function(account) {
      if ( !account )
        return;
      models.Account.findById(contactId, function(contact){
        models.Account.removeInvitation(account, contactId);
        models.Account.removeInvitation(contact, accountId);
              app.triggerEvent('event:' + contactId, {
                from: contactId,
                data: 1,
                action: 'newinvitation'
              });
      });
            app.triggerEvent('event:'+accountId,{
              from:accountId,
              data:1,
              action:'newinvitation'
            });
    });
    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

app.delete('/accounts/:id/:collection/:secondId/remove', function(req,res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;

    var collection = req.param('collection',null);
    var secondId = req.param('secondId', null);

    // Missing contactId, don't bother going any further
    if ( null == secondId ) {
      res.send(400);
      return;
    }
    models.Account.findById(accountId, function(account) {
      if ( !account )
        return;
      models.Account.remove(account,collection,secondId);
    });
    res.send(200);
  });

app.post('/accounts/:id/updateFieldsProfile',function(req,res){
  console.log('Actualizando campos '+req.param('parameters'),'');
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;

  var fields = req.param('parameters','');
  models.Account.updateField(accountId, fields);

  res.send(200);
});

app.post('/accounts/:id/updatefields',function(req,res){
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;

  var fields = req.param('fields','');
  var field_validate=req.param('field_validate');
  models.Account.findById(accountId,function(account){
    if(field_validate!=''){
      if(account[field_validate]!=undefined){
        if(account[field_validate]!=''){
          console.log('Ya hay informacion guardada');
        }else
          models.Account.updateField(accountId,fields);
      }else
        models.Account.updateField(accountId,fields);
    }else
    models.Account.updateField(accountId,fields);
  });
  res.send(200);
});

app.post('/accounts/:id/insertfriendsapi', function(req,res){
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;

  var fields = req.param('fields','');
  var field_validate=req.param('field_validate');

  var encontrado=false;

  models.Account.findById(accountId, function(account){
    //if(account[field_validate]!=undefined){
      account.extern_contacts.forEach(function(friend){
        if(friend.id == fields.id)
          encontrado=true;
      });

      if(!encontrado){
        account.extern_contacts.push(fields);
        account.save();
      }
  });
  res.send(200);
});

app.get('/accounts/:id', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    if ( accountId == 'me' || models.Account.hasContact(account, req.session.accountId) ) {
      account.isFriend = true;
    }
    res.send(account);
  });
});
}