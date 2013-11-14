define(function(require) {
  var Professions = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/professions'
  });

  return Professions;
});