define(function(require) {
  var ProfileHeader = Backbone.Model.extend({
      urlRoot: '/accounts/' + this.accountId + '/getinfoheader'
  });

  return ProfileHeader;
});