define(['models/Generic'], function(Generico) {
  var GenericoCollection = Backbone.Collection.extend({
    model: Generico
  });
  return GenericoCollection;
});