define(function(require) {
  var Post = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/displayname'
  });

  return Post;
});