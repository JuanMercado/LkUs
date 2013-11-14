define(['models/Addresses'], function(Addresses) {
  var AddressesCollection = Backbone.Collection.extend({
    model: Addresses
  });
  return AddressesCollection;
});