define(function(require) {
  var Addresses = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/addresses'
  });

  return Addresses;
});