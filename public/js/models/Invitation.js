define(function(require) {
  var invitation = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/invitation'
  });

  return invitation;
});
