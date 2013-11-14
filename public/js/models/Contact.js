define(function(require) {
  var Contact = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/contact'
  });

  return Contact;
});
