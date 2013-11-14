define(['SocialNetView','text!templates/menu/contacts.html'],
function(SocialNetView,ContactsMenuTemplate) {
  var contactMenuView = SocialNetView.extend({
    el: $('#Qcontacts'),

    initialize: function(options) {
    },
    render: function() {
    	this.$el.html(_.template(ContactsMenuTemplate,{model:this.model}));
    }
  });

  return contactMenuView;
});