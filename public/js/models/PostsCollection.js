define(['models/Posts'], function(Post) {
  var PostCollection = Backbone.Collection.extend({
    model: Post
  });
  return PostCollection;
});