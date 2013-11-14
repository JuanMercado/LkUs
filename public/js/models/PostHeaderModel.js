define(function(require) {
  var PostHeader = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/getinfoheader'
  });

  return PostHeader;
});