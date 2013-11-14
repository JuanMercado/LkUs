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

  var ProfessionsSchema = new mongoose.Schema({
    profession: { type: String},
    image:      { type: String},
    added:      { type: Date }
  });

  var Professions = mongoose.model('Professions', ProfessionsSchema);

  var findByString = function(searchStr,fieldsShowing, callback) {
    var searchRegex = new RegExp(searchStr, 'i');
    Professions.find({
      $or: [
        { 'profession': { $regex: searchRegex } }
      ]
    },fieldsShowing, callback);
  };

  var findByArray = function(where, fields, callback){
    Professions.find(where, fields, function(err,doc){
      callback(doc);
    });
  };

  return {
    findByString: findByString,
    findByArray: findByArray,
    Professions: Professions
  }
}
