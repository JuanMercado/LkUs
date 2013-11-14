define(['SocialNetView', 'models/Invitation','models/GenericCollection', 'views/invitation/invitation',
  'views/invitation/searching', 'text!templates/invitation/invitations.html',
  'models/ProfileHeader'],
function(SocialNetView, InvitationModel,GenericCollection, InvitationView,
  SearchingView, InvitationTemplate, ProfileHeaderModel) {
  var contactsView = SocialNetView.extend({
    accountId : 0,
    el: $('#myBodyContent'),
    events:{
      'keyup input[id=follow_searching]':'searching'
    },
    initialize: function(options) {
      this.options= options;
      options.socketEvents.bind('addInvitation:me',this.onSocketAddedInvitation,this);
      options.socketEvents.bind('removeInvitation:me',this.onSocketAddedInvitation,this);
      this.collection.on('reset', this.renderCollectionReset, this);
      this.collection.on('add',this.onInvitationAdded,this);
    },
    onSocketAddedInvitation: function(data){
      var newInvitation=data.data;
      this.collection.add(new InvitationModel(newInvitation));
    },
    renderCollectionReset: function(collection) {
      var that= this;
      this.collection.each(function(model){
        that.onInvitationAdded(model);
      });
    },
    onInvitationAdded: function(invitation){
      var where={_id:'me'};
      var fields ='_id name photoUrlSmall accounttype photoUrlLarge professions';
      var table='NaN';
      var model = new ProfileHeaderModel();
      var status=invitation.attributes.statusmine;
      model.url = '/accounts/'+invitation.attributes.contactId+'/'+where+'/'+fields+'/'+table+'/resultarray';
      var html = (new InvitationView({model:model,status:status})).render().el;
      $(html).appendTo('.contacts_list').hide().fadeIn('slow');
      model.fetch();
    },
    searching: function(e){
      $('.contacts_list').empty();
      if($('#follow_searching').val().length>0){
        var accounts = new GenericCollection();
        accounts.url = '/accounts/me/_id name photoUrlSmall proffesions invitations/'+$('#follow_searching').val()+'/findmycontacts';
        var htmlS = (new SearchingView({collection:accounts})).render().el;
        $(htmlS).appendTo('.contacts_list');
        accounts.fetch();
      }else{
      }
    },
    render: function(resultList) {
      this.$el.html(_.template(InvitationTemplate));
    }

  });

  return contactsView;
});