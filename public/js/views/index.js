define(['SocialNetView', 'text!templates/index.html',
  'views/post/posts','models/Posts','views/displaynameview',
  'models/DisplayNameModel','views/post/postheaderview',
  'models/PostHeaderModel','views/menu/invitations','views/menu/contacts'],
function(SocialNetView, indexTemplate, PostView,
  Post,DisplayNameView,DisplayNameModel, PostHeaderView,
  PostHeaderModel,InvitationsMenuView,ContactsMenuView) {
    var indexView = SocialNetView.extend({
    el: $('#myBodyContent'),
    events: {
      "submit #frmPost": "updatePost",
      'click a[name=r-close]': 'close',
      'click button[name=b_r_post]': 'submitResponse'
    },
    initialize: function(options) {
      options.socketEvents.bind('post:me', this.onSocketPostAdded, this );
      options.socketEvents.bind('newinvitation:me', this.onSocketSendInvitation, this );
      options.socketEvents.bind('newcontact:me', this.onSocketFriends, this );
      this.collection.on('add',this.onPostAdded,this);
      this.collection.on('reset',this.onPostCollectionReset,this);
    },
    close :function(){
      $('.response_post').hide('slow');
      $('textarea[name=i_r_post]').val('');
      $('#input_response_post').val('');
      return false;
    },
    submitResponse:function(event){
      if($('textarea[name=i_r_post]').val()!=""){
        var response = {
          ContactId : 'contactid',
          answer : $('textarea[name=i_r_post]').val(),
          added: new Date()
        }
      }
    },
    onSocketSendInvitation:function(){
      this.renderInvitationsMenuView();
    },
    onSocketFriends:function(){
      this.renderFriendsMenuView();
    },
    renderInvitationsMenuView: function(){
      $.get('accounts/me/contmenu',{
        where: {_id:"me"},
        firstarray: 'invitations',
        fields:'invitations'
      }).success(function(response){
          var statusHtml = (new InvitationsMenuView({model:response})).render();
      });
    },
    renderFriendsMenuView: function(){
      $.get('accounts/me/contmenu',{
        where: {_id:"me"},
        firstarray: 'contacts',
        fields:'contacts'
      }).success(function(response){
          var statusHtml = (new ContactsMenuView({model:response})).render();
      });
    },
    /*POST*/
    onPostCollectionReset: function(){
      var that = this;
      $('.status_list').empty();
      this.collection.each(function (model) {
        that.onPostAdded(model);
      });
    },
    onSocketPostAdded: function(data){
      var newPost = data.data;
      this.collection.add(new Post(newPost));
    },
    onPostAdded:function(post){
        var postHtml = (new PostView({model:post})).render().el;
        $(postHtml).prependTo('.status_list').hide().fadeIn('slow');
    },
    updatePost: function(){
      var postText = $('textarea[name=status]').val();
      if(postText!=""){
        var postCollection = this.collection;
        $.post('/accounts/me/posts',{
          description: postText
        }).success(function(){
          $('textarea[name=status]').val('');
        });
      }
      return false;
    },
    render: function() {
      this.renderFriendsMenuView();
      this.renderInvitationsMenuView();
      this.$el.html(_.template(indexTemplate));
    }
  });

  return indexView;
});
