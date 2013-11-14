define(['models/Invitation'], function(Invitation) {
  var InvitationCollection = Backbone.Collection.extend({
    model: Invitation
  });

  return InvitationCollection;
});