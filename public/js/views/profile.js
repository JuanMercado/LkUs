define(['SocialNetView', 'text!templates/profile.html','views/displaynameview','views/addressesview',
  'models/AddressesCollection','models/TelephonesCollection','models/GenericCollection','models/Generic',
  'views/profession/listprofessions','views/profession/listprofession'],
  function(SocialNetView,  profileTemplate, DisplayNameView, AddressesView, AddressesCollection,TelephonesCollection,
    GenericCollection, GenericModel ,ProfessionsView, ProfessionView)
{
  var profileView = SocialNetView.extend({
    el: $('#myBodyContent'),
    events: {
        "click span": "clickFirst",
        "blur input[name=i-last]": "updateField",
        "blur input[name=i-first]": "updateField",
        "click button#AddAddress" : "SaveAddress",
        "click #show-prof":"showProfessionsList",
        "click .delete":"deleteProfession"
    },
    initialize: function (options) {
      this.model.bind('change', this.render, this);
    },

    deleteProfession: function(event){
      var id = $(event.currentTarget).attr('id');
      var object = $(event.currentTarget);
      if(confirm('¿Esta seguro de eliminar su profesión, ya no sera notificado en las busquedas de esta profesión?')){
        $.ajax({
          url: '/accounts/me/professions/'+id+'/remove',
          type: 'DELETE'
          }).done(function onSuccess() {

          }).fail(function onError() {
        });
        object.fadeOut(function(){

        });
      }
      return false;
    },
    SaveAddress: function(){
      var ok=true;
      $('.error').text('');

      if($('#textAddress').val()==''){
        $('.error').fadeIn().text('La dirección no puede ir vacía.');
        ok=false;
      }

      if(ok){
        var parameters = {
          addresses:[{
            address: $('#textAddress').val(),
            added: new Date()
          }]
        }
        var parameter = {
            address: $('#textAddress').val(),
            added: new Date()
        }
        var where = {
          _id: this.model.get('_id')
        }
        $.post('accounts/me/savearraywithtwoarrays', {
            firstarray :'profile',
            secondarray:'addresses',
            parameter: parameter,
            parameters: parameters,
            where : where,
            fields: 'profile.addresses'
        });
      }
      return false;
    },
    clickFirst: function(){
        $('.p-c-span').hide();
        $('.p-c-input').show();
        $('input[name=i-first]').focus();
    },
    updateField: function(){
      var first= $('input[name=i-first]').val()=='Nombres' ? '':$('input[name=i-first]').val();
      var last = $('input[name=i-last]').val()=='Apellidos' ? '':$('input[name=i-last]').val();
      var full = first +' '+last;
      var parameters = {
          first_name: first,
          last_name: last,
          name: full
      }
      $.post('accounts/me/updateFieldsProfile', {
            parameters: parameters
      });
      return false;
    },
    showProfessionsList: function(event){
      $('#show-list-professions').fadeIn('slow');
    },
    render: function() {
        if(this.model.get('photoUrlSmall')!=undefined){
          var that = this;
          this.$el.html(_.template(profileTemplate,{model:this.model.toJSON()}));
          fields='NaN';
          table='NaN';
          var w = 'NaN';

          var professionsArray = this.model.get('professions');
          $.each(professionsArray, function(i,item){
            var myModel = new GenericModel();
            myModel.url = '/professions/'+item._id+'/'+fields+'/'+table+'/resultarray';
            var listHtml = (new ProfessionView({model:myModel , myTarget:'#p-profesions ul'})).render().el;
            myModel.fetch();
          });

          var listCollection = new GenericCollection();
          listCollection.url = '/professions/'+w+'/'+fields+'/'+table+'/resultarray';
          var listHtml = (new ProfessionsView({collection:listCollection,socketEvents:this.options.socketEvents,isDraggable:true,myTarget:'#list-profession ul'})).render().el;
          $(listHtml).appendTo("#show-list-professions");
          listCollection.fetch();

          var addressCollection = new AddressesCollection();
          addressCollection.url = '/accounts/me/addresses';
          var addressView = (new AddressesView({ collection: addressCollection,socketEvents:this.options.socketEvents})).render().el;
          $(addressView).appendTo('.p-address-address');
          addressCollection.fetch();
          $('.p-c-input').hide();
        }
    }
  });

  return profileView;
});