define(['models/Telephones'], function(Telephones) {
  var TelephonesCollection = Backbone.Collection.extend({
    model: Telephones
  });

  return TelephonesCollection;
});