define(['SocialNetView', 'text!templates/post/posts.html','views/post/postheaderview','models/PostHeaderModel'],
  function(SocialNetView, postsTemplate, PostHeaderView, PostHeaderModel) {
  var postsView = SocialNetView.extend({
    postId: 0 ,
    tagName: 'div',
    myTarget:'',
    initialize: function(options){
    },
    render: function() {
      if(this.model.get('postId')!=undefined){
        this.$el.html(_.template(postsTemplate,{ model: this.model.toJSON()}));
        var account = this.model.get('accountId');
        var postId = this.model.get('postId');
        var model = new PostHeaderModel();
        model.url = 'accounts/'+account+'/getinfoheader';
        var shtml = (new PostHeaderView({model:model, postId:postId})).render().el;
        $(shtml).appendTo('.header-post');
        model.fetch();
      }
      return this;
    }
  });
  return postsView;
});