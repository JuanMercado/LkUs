define(['SocialNetView', 'views/profession/listprofession'],
  function(SocialNetView, ProfessionView) {
  var searchingView = SocialNetView.extend({
    initialize: function(options) {
      this.collection.on('reset', this.renderCollectionReset, this);
    },
    renderCollectionReset: function(){
      var that = this;
      this.collection.each(function (model){
        that.onAdded(model);
      });
    },
    onAdded: function (profession){
        var html =(new ProfessionView({model:profession})).render().el;
        $(html).appendTo('#list-profession').hide().fadeIn('slow');
    },
    render: function() {
      return this;
    }
  });

  return searchingView;
});