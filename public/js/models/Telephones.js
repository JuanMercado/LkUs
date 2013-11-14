define(function(require) {
  var Telephones = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/telephones'
  });

  return Telephones;
});