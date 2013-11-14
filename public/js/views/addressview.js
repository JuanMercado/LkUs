define(['SocialNetView', 'text!templates/addresstempl.html'],
  function(SocialNetView, AddressTemplate) {
  var addressView = SocialNetView.extend({
    initialize: function(options) {
    },
    render: function() {
      this.$el.html(_.template(AddressTemplate, {
        model: this.model
      }));
      return this;
    }
  });

  return addressView;
});