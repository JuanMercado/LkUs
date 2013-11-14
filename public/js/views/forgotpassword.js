define(['SocialNetView', 'text!templates/forgotpassword.html'], function(SocialNetView, forgotpasswordTemplate) {
  var forgotpasswordView = SocialNetView.extend({
    requireLogin: false,

    el: $('#loginForm'),

    events: {
      "submit form": "password"
    },

    password: function() {
      $.post('/forgotpassword', {
        email: $('input[name=email]').val()
      }, function(data) {
        console.log(data);
      });
      return false;
    },

    render: function() {
      this.$el.html(forgotpasswordTemplate);
    }
  });

  return forgotpasswordView;
});
