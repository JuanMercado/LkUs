define(['SocialNetView', 'text!templates/invitation/invitation.html'
  ,'views/menu/invitations'],
  function(SocialNetView, contactTemplate, InvitationsMenuView) {
  var contactView = SocialNetView.extend({
    ok          : false,
    total       : 0,
    addbutton   : false,
    removeButton: false,
    status:'',
    tagName: 'div',
    events: {
      "click .btnadd" : "addContact",
      "click .btnfollow" : "sendInvitation",
      "click .btnfollowcancel" : "cancelInvitation"
    },
    initialize: function(options) {
      this.model.bind('change',this.render,this);
    },
    addContact: function(event){
      var contactId = $(event.currentTarget).attr('id').replace('bfa-','');
      $.post('/accounts/me/contact',
        {
          contactId: contactId
        },
        function onSuccess() {
          var btnadd= $('#bfa-'+contactId).text('Pendiente').attr('disabled','disabled');
        }, function onError() {
        }
      );
    },
    sendInvitation: function(event) {
      var contactId = $(event.currentTarget).attr('id').replace('bf-','');
      $.post('/accounts/me/sendinvitation',
        {
          contactId: contactId
        },
        function onSuccess() {
          var btnadd= $('#bf-'+contactId).text('Pendiente').attr('disabled','disabled');
        }, function onError() {
        }
      );
    },
    cancelInvitation: function(event) {
      var contactId = $(event.currentTarget).attr('id').replace('bfc-','');
      $.ajax({
        url: '/accounts/me/removeinvitation',
        type: 'DELETE',
        data: {
          contactId: contactId
        }}).done(function onSuccess() {
        }).fail(function onError() {
      });
    },
    render: function() {
      if(this.model.get('photoUrlSmall')!=undefined){
        this.$el.html(_.template(contactTemplate,{model:this.model.toJSON(),addButton:this.addButton,status:this.options.status}));
      }
      return this;
    }
  });

  return contactView;
});