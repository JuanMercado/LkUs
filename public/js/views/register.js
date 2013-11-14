define(['SocialNetView', 'text!templates/register.html'], function(SocialNetView, registerTemplate) {
  var registerView = SocialNetView.extend({
    requireLogin: false,

	el: $('#loginForm'),

    events: {
      "submit form": "register"
    },

    register: function() {
      $.post('/register', {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
      }).success(function(){
        window.location.hash = 'login';
      }).error(function(err){
        $(".error").text('Llene todos los campos '+err);
        $(".error").slideDown();
      });

      return false;
    },

    render: function() {
      this.$el.html(registerTemplate);
      $(".error").hide();
      $("input[name=email]").focus();
    }
  });

  return registerView;
});
