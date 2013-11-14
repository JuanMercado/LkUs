define(['SocialNetView', 'text!templates/addressestempl.html','views/addressview','models/Addresses'],
function(SocialNetView , AddressesTemplate, AddressView,AddressesModel) {
    var addressesView = SocialNetView.extend({
    events:{
    },
    initialize: function(options){
    	this.collection.on('reset', this.renderCollectionReset, this);
      this.collection.on('add', this.onAddressAdded, this);
      options.socketEvents.bind('addresschange:me',this.onSocketsAddressAdded,this);
    },
    onSocketsAddressAdded: function (data){
      var newAddress = data.data;
      this.collection.add(new AddressesModel(newAddress));
    },
    renderCollectionReset: function() {
      var that = this;
      this.collection.each(function (model) {
        that.onAddressAdded(model);
      });
    },
    onAddressAdded: function(address){
      var addressHtml = (new AddressView({ model: address })).render().el;
      $(addressHtml).appendTo('.p-address-address').hide().fadeIn('slow');
      $('#textAddress').val('');
    },
    render: function() {
      return this;
    }
  });

  return addressesView;
});