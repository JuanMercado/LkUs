module.exports = function(app, config, mongoose, nodemailer) {
  var crypto = require('crypto');

  var schemaOptions = {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  };

  var Extern_contacts = new mongoose.Schema({
    id:           { type: String},
    type_api:     { type: String},
    name:         { type: String},
    first_name:   { type: String},
    last_name:    { type: String},
    picture:      { type: String},
    gender:       { type: String}
  },schemaOptions);

  var Contact = new mongoose.Schema({
    accountId: { type: mongoose.Schema.ObjectId },
    id:        { type: String},
    added:     { type: Date },     // When the contact was added
    updated:   { type: Date }      // When the contact last updated
  }, schemaOptions);

  var Addresses = new mongoose.Schema({
    address:   { type: String },
    added:     { type: Date }
  },schemaOptions);

  var Telephones = new mongoose.Schema({
    telephonetype:  { type: String},
    telephone:      { type: String },
    added:          { type: Date }
  },schemaOptions);

  var Profile = new mongoose.Schema({
      biography: { type:String },
      birthday: {
        day:     { type: Number, min: 1, max: 31, required: false },
        month:   { type: Number, min: 1, max: 12, required: false },
        year:    { type: Number }
      },
      addresses : [Addresses],
      telephones :[Telephones]
    }, schemaOptions);

  var Professions = new mongoose.Schema({
    professionId:     { type:mongoose.Schema.ObjectId},
    added:            { type: Date }
  }, schemaOptions);

  var Invitations = new mongoose.Schema({
    contactId :       { type: mongoose.Schema.ObjectId },
    statusmine:       { type: String },
    statusfollower:   { type: String },
    added:            { type: Date  }
  }, schemaOptions);

  var ResponsePost = new mongoose.Schema({
      ContactId :       { type: mongoose.Schema.ObjectId },
      answer:           { type: String } ,
      added:            { type: Date   }
  }, schemaOptions);

  var Post = new mongoose.Schema({
      accountId:      { type: mongoose.Schema.ObjectId },
      postId:         { type: mongoose.Schema.ObjectId },
      description:    { type:String},
      responsepost:   [ResponsePost],
      added:          { type:Date}
  }, schemaOptions);

  var Archivist = new mongoose.Schema({
      name:           { type: String },
      postId:         { type: mongoose.Schema.ObjectId },
      added:          { type: Date }
  }, schemaOptions);

  Contact.virtual('online').get(function(){
    return app.isAccountOnline(this.get('accountId'));
  });

  var AccountSchema = new mongoose.Schema({
    email:            { type: String, unique: true },
    email_facebook:   { type: String},
    email_linkedin:   { type:String},
    password:         { type: String },
    name:             { type:String},
    first_name:       { type:String},
    last_name:        { type:String},
    profile:          [ Profile ],
    professions:      [ Professions ],
    accounttype:      { type: String} ,
    photoUrlSmall:    { type: String },
    photoUrlLarge:    { type: String} ,
    extern_contacts:  [Extern_contacts],
    contacts:  [ Contact ],
    post :            [ Post ],
    archivist:        [ Archivist ],
    invitations:      [ Invitations ],
    added:            { type: Date },     // When the contact was added
    update:           { type: Date }     // When the contact was added
  });

  var Account = mongoose.model('Account', AccountSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Cuenta creada!!');
  };

  var changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Account.update({_id:accountId}, {$set: {password:hashedPassword}},{upsert:false},function changePasswordCallback(err) {
    });
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email: email}, function findAccount(err, doc){
      if (err) {
        // Email address is not a valid user
        callback(false);
      } else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        resetPasswordUrl += '?account=' + doc._id;
        smtpTransport.sendMail({
          from: 'jreyej@hotmail.com',
          to: doc.email,
          subject: 'Solicitud de password LinkUs',
          text: 'Click aqui para cambiar tu password: ' + resetPasswordUrl
        }, function forgotPasswordResult(err) {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

  var findByString = function(searchStr,fieldsShowing, callback) {
    var searchRegex = new RegExp(searchStr, 'i');
    Account.find({
      $or: [

        { 'extern_contacts.name': { $regex: searchRegex } },
        { email:       { $regex: searchRegex } }
      ]
    },fieldsShowing, callback);
  };

  var findById = function(accountId, callback) {
    Account.findOne({_id:accountId}, function(err,doc) {
      callback(doc);
    });
  };

  var findByArray = function(where, fields, callback){
      Account.find(where, fields, function(err,doc){
        callback(doc);
      });
  };

  var getObjectByIdWithFields = function(accountId, fields, callback){
      Account.findOne({_id : accountId},fields,function (err,doc){
        callback(doc);
      });
  };

  var addContact = function(account, addcontact) {
    contact = {
      accountId: addcontact,
      added: new Date(),
      updated: new Date()
    };

    console.log(contact);
    account.contacts.push(contact);
    account.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  };

  var addArray = function(account, addparameters){
    console.log('Function-AddArray:'+account+' - '+addparameters);
    account.push(addparameters);
    account.save(function (err){
      console.log(err);
    })
  }

  var removeContact = function(account, contactId) {
    if ( null == account.contacts ) return;
    account.contacts.forEach(function(contact) {
      if ( contact.accountId == contactId ) {
        account.contacts.remove(contact);
      }
    });
    account.save();
  };

  var remove = function(account,first,Id){

    if (account[first])
      {
        console.log('Function-Remove: '+account[first]);
        account[first].forEach(function(that){
          if(that._id==Id){
            account[first].remove(that);
          }
        });
      }
      account.save();
  };

  var removeInvitation = function(account, contactId){
    if ( null == account.invitations )
      return;
      account.invitations.forEach(function(invitation) {
      if ( invitation.contactId == contactId ) {
        account.invitations.remove(invitation);
      }
    });
    account.save();
  };

  var hasContact = function(account, contactId) {
    if ( null == account.contacts ) return false;

    account.contacts.forEach(function(contact) {
      if ( contact.accountId == contactId ) {
        return true;
      }
    });
    return false;
  };

  var register = function(email, password) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    var user = new Account({
      email: email,
      name: '',
      first_name: '',
      last_name: '',
      photoUrlSmall : '/images/photos/171.jpg',
      photoUrlLarge : '/images/photos/171.jpg',
      password: shaSum.digest('hex'),
      accounttype: "Normal",
      added: new Date()
    });
    user.save(registerCallback);
  };

  var updateField = function(account, fields ) {
    Account.update({_id:account},{$set:fields},{upsert:false}, function changeFieldsCallback(err) {
    });
  };

  var updateFieldArray = function(account,fields){
    Account.update({_id:account},{$push : fields}, function changeFieldsCallback(err) {
    });
  };

  var getObjectByIdWithFields = function(accountId, fields, callback){
      Account.findOne({_id : accountId},fields,function (err,doc){
        callback(doc);
      });
  };

  var insertAddressById = function(account,parameters,fields){
    Account.update({_id:account},{'$addToSet':{'profile.addresses':parameters}}, function insertCallback(err){
      if(err){
        console.log(err);
      }
    });
  };

  var insertResponseById = function(account,parameters){
    Account.update({_id:account},{"$addToSet":{"post.responsepost":parameters}}, function insertCallback(err){
      if(err){
      }
    });
  };

  return {
    findById: findById,
    findByArray: findByArray,
    register: register,
    hasContact: hasContact,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    findByString: findByString,
    addContact: addContact,
    addArray: addArray,
    remove: remove,
    removeContact: removeContact,
    removeInvitation: removeInvitation,
    login: login,
    updateField: updateField,
    updateFieldArray : updateFieldArray,
    insertAddressById : insertAddressById,
    insertResponseById : insertResponseById,
    getObjectByIdWithFields : getObjectByIdWithFields,
    Account: Account
  }
}
