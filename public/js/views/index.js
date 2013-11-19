define(['SocialNetView', 'text!templates/index.html',
  'views/post/posts','models/Posts','views/displaynameview',
  'models/DisplayNameModel','views/post/postheaderview',
  'models/PostHeaderModel','views/menu/invitations','views/menu/contacts'],
function(SocialNetView, indexTemplate, PostView,
  Post,DisplayNameView,DisplayNameModel, PostHeaderView,
  PostHeaderModel,InvitationsMenuView,ContactsMenuView) {
    var indexView = SocialNetView.extend({
    el: $('#myBodyContent'),
    token:'',
    events: {
      "submit #frmPost": "updatePost",
      "click a[name=r-close]": "close",
      "click button[name=b_r_post]": "submitResponse",
      "click #btnFacebook": "loginFacebook"
    },
    loginFacebook: function(){
      this.facebookLog();
    },
    initialize: function(options) {
      options.socketEvents.bind('post:me', this.onSocketPostAdded, this );
      options.socketEvents.bind('newinvitation:me', this.onSocketSendInvitation, this );
      options.socketEvents.bind('newcontact:me', this.onSocketFriends, this );
      this.collection.on('add',this.onPostAdded,this);
      this.collection.on('reset',this.onPostCollectionReset,this);
      var that= this;

      $.get('/accesstoken',function(res){
        //if(JSON.stringify(res).length>2){
          that.getFacebook(res);
        //}else{
          //that.facebookLog();
        //}
      });
    },
    facebookLog: function(){
      var token='';
      $.get('http://localhost:8080/loginfacebook', function(){

      });
    },
    getFacebook: function(res){
      var url='https://graph.facebook.com/766091662?access_token='+res.access_token+'&fields=birthday,email,gender,first_name,last_name,name,picture.type(normal),friends.fields(birthday,email,gender,first_name,last_name,name,picture.type(normal))';
        $.get(url,function(req){
          if(JSON.stringify(req.friends)!=undefined){
            var data = {
              first_name: req.first_name,
              last_name: req.last_name,
              name: req.name,
              photoUrlSmall: req.picture.data.url,
              photoUrlLarge: req.picture.data.url,
              email_facebook: req.email
            };
            $.post('/accounts/me/updatefields',
            {
              fields:data,
              field_validate: 'email_facebook'
            },function(){
              $.each(req.friends.data,function(friend){
                var Extern_contacts = {
                id:           req.friends.data[friend].id,
                type_api:     'facebook',
                name:         req.friends.data[friend].name,
                first_name:   req.friends.data[friend].first_name,
                last_name:    req.friends.data[friend].last_name,
                picture:      req.friends.data[friend].picture.data.url,
                gender:       req.friends.data[friend].gender
              };
              $.post('/accounts/me/insertfriendsapi',{
                fields: Extern_contacts,
                field_validate: 'Extern_contacts'
              },function(){

              });
              });


            });

        }

          //  alert(JSON.stringify(req));
        },'jsonp');
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
      this.$el.html(_.template(indexTemplate));
    }
  });

  return indexView;
});
