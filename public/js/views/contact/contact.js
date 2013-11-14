define(['SocialNetView', 'text!templates/contact/contact.html'],
  function(SocialNetView, contactTemplate) {
  var contactView = SocialNetView.extend({
    ok          : false,
    total       : 0,
    addbutton   : false,
    removeButton: false,
    tagName: 'div',
    events: {
      "click .btnfollowcancel": "cancelInvitation"
    },
    cancelInvitation: function(event) {
      var contactId = $(event.currentTarget).attr('id').replace('bfc-','');
      alert(contactId);
      $.ajax({
        url: '/accounts/me/contact',
        type: 'DELETE',
        data: {
          contactId: contactId
        }}).done(function onSuccess() {
        }).fail(function onError() {
        });
    },
    initialize: function() {
      // Set the addButton variable in case it has been added in the constructor
      if ( this.options.addButton ) {
        this.addButton = this.options.addButton;
      }
      if ( this.options.removeButton ) {
        this.removeButton = this.options.removeButton;
      }
    },
    render: function() {
      if(!this.options.ok){
        this.$el.html(_.template(contactTemplate, {
          model: this.model,
          addButton: this.addButton,
          removeButton: this.removeButton
        }));
      }else{
        this.$el.html(_.template(contactTemplate, {
          model: this.model.toJSON(),
          addButton: this.addButton,
          removeButton: this.removeButton
        }));
    }
      return this;
    }
  });

  return contactView;
});