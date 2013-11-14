define(['SocialNetView', 'text!templates/displaynametempl.html'],
function(SocialNetView, displaynameTemplate) {
    var displaynameView = SocialNetView.extend({
    initialize: function(options){
    },

    render: function() {
    if(this.model){
        $('.myName').html(_.template(displaynameTemplate,this.model.toJSON()));
    }
      return this;
    }
  });

  return displaynameView;
});