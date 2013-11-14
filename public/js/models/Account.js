define(['models/PostsCollection','models/DisplayNameModel'], function(PostsCollection,DisplayNameModel) {
  var Account = Backbone.Model.extend({
    urlRoot: '/accounts',
    initialize: function() {
      this.name 		 = new DisplayNameModel();
      this.posts         = new PostsCollection();
      this.posts.url     = '/accounts/' + this.id + '/posts';
    }
  });
  return Account;
});
