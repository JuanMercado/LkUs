define(['SocialNetView', 'models/Contact', 'views/contact/contact', 'text!templates/contact/contacts.html'],
function(SocialNetView, Contact, ContactView, contactsTemplate) {
  var contactsView = SocialNetView.extend({
    el: $('#myBodyContent'),
    events:{
      'keyup input[id=follow_searching]':'searching'
    },
    initialize: function() {
      this.collection.on('reset', this.renderCollection, this);
    },
    searching: function(e){
      var view = this;
      if($('#follow_searching').val().length>0){

        $.get('/accounts/me/findmycontacts',
         $('input[name=searchStr]')
        , function(data) {
            //view.render(data);
            $('.contacts_list').empty();
            _.each(data, function (contactJson) {
              //alert(JSON.stringify(contactJson._id));
              $.get('/accounts/me/contacts', function(mycontacts){
                _.each(mycontacts,function(mycontact){
                });
              }).error(function(){
              });
          /*var contactModel = new Contact(contactJson);
          var contactHtml = (new ContactView({ ok : true , addButton: true, model: contactModel })).render().el;
          $(contactHtml).appendTo('.contacts_list');*/
        });
        }).error(function(){
            $(".contacts_list").text('No se encontraron contactos.');
            $(".contacts_list").slideDown();
        });
      }else{
        view.renderCollection(this.collection);
      }
    },
    render: function(resultList) {
      this.$el.html(_.template(contactsTemplate));
    },
    renderCollection: function(collection) {
      $('.contacts_list').empty();
      collection.each(function(contact) {
        $.get('accounts/'+contact.attributes.accountId+'/getinfoheader', {
        }).success(function(response){
          var statusHtml = (new ContactView({ ok : false , removeButton: true, model: response })).render().el;
          $(statusHtml).appendTo('.contacts_list');
        });

      });
    }
  });

  return contactsView;
});