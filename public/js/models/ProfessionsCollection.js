define(['models/Professions'], function(Professions) {
  var ProfessionsCollection = Backbone.Collection.extend({
    model: Professions
  });

  return ProfessionsCollection;
});