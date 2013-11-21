define(['SocialNetView', 'text!templates/post/postheadtempl.html'],
	function(SocialNetView, postsTemplate) {
  var postsView = SocialNetView.extend({
    postId :  0,
    events:{
      'click a[name=p-response]':'response'
    },
    initialize: function(options){
      this.model.bind('change',this.render,this);
    },
    response:function (event){
      var currentPostId=$(event.currentTarget).attr('id').replace('p-r-id-','');
      if($('.response_post').css('display')!='none'){
        $('.response_post').hide('slow');
        $('textarea[name=i_r_post]').val('');
        $('#input_response_post').val('');
        $('.response_post').show('slow');
        $('#input_response_post').val(currentPostId);
      }else{
        $('.response_post').show('slow');
        $('#input_response_post').val(currentPostId);
      }
    },
    render: function() {
      if(this.model.get('photoUrlSmall')!=undefined){
        this.$el.html(_.template(postsTemplate,
          {
            model : this.model.toJSON(),
            postId: this.options.postId
          }));
      }
      return this;
    }
  });

  return postsView;
});
