define(['SocialNetView', 'text!templates/profileinfo.html'],
function(SocialNetView,  profileinfoTemplate)
{
  var profileinfoView = SocialNetView.extend({
    el: $('#myName'),

    events: {
      //"submit form": "postStatus"
    },
    initialize: function (options) {
      this.socketEvents = options.socketEvents;
      this.model.bind('change', this.render, this);
    },
    render: function() {
      this.$el.html(_.template(profileinfoTemplate,this.model.toJSON()));
    }
  });
  return profileinfoView;
});
