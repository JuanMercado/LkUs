define(['SocialNetView', 'text!templates/menu/invitations.html'],
function(SocialNetView, invitationMenuTemplate) {
  var invitationsMenuView = SocialNetView.extend({
    el: $('#Qinvitation'),
    initialize: function(options) {
    },
    render: function() {
      this.$el.html(_.template(invitationMenuTemplate,{model:this.model}));
    }
  });

  return invitationsMenuView;
});
