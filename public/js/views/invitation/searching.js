define(['SocialNetView', 'views/invitation/invitation'],
  function(SocialNetView, InvitationView) {
  var searchingView = SocialNetView.extend({
    accountId:0,
    ok          : false,
    addbutton   : false,
    removeButton: false,
    status:'',
    tagName: 'div',
    events: {
    },
    initialize: function(options) {
      this.collection.on('reset', this.renderCollectionReset, this);
    },
    renderCollectionReset: function(){
      var that = this;
      this.collection.each(function (model){
        that.onInvitationAdded(model);
      });
    },
    onInvitationAdded: function (invitation){
      if(invitation){
        var inv=invitation.get('extern_contacts');
        var status='Invitar';
        if(inv.length>0)
          status=inv[0].statusfollower;
        var html =(new InvitationView({model:invitation,status:status})).render().el;
        $(html).appendTo('.contacts_list').hide().fadeIn('slow');
      }
    },
    render: function() {
      return this;
    }
  });

  return searchingView;
});