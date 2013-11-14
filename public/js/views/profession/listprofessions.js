define(['SocialNetView', 'models/Generic','models/GenericCollection',
  'views/profession/listprofession','text!templates/profession/listprofessions.html',
  'views/profession/searching'],
function(SocialNetView, Model, Collection, ProfessionView,professionTemplate,
  SearchingView) {
  var professionsView = SocialNetView.extend({
    myTarget:'',
    isDraggable:false,
    events:{
      'keyup input[id=searching]':'searching'
    },
    initialize: function(options) {
      this.options= options;
      options.socketEvents.bind('addProffession:me',this.onSocketAdded,this);
      this.collection.on('reset', this.renderCollectionReset, this);

    },
    onSocketAdded: function(data){
      var newData=data.data;
      this.collection.add(new Model(newData));
    },
    renderCollectionReset: function(collection) {
      var that= this;
      collection.each(function(model){
        that.onAdded(model,that.options.myTarget);
      });
    },
    onAdded: function(profession,myTarget){
      var html = (new ProfessionView({model:profession,myTarget:myTarget,isDraggable:this.options.isDraggable})).render().el;
    },
    searching: function(e){
      var view= this;
      $('#list-profession').empty();
      if($('#searching').val().length>0){
        var professionsColec = new Collection();
        professionsColec.url = '/professions/me/NaN/'+$('#searching').val()+'/findprofession';
        var htmlS = (new SearchingView({collection:professionsColec})).render().el;
        $(htmlS).appendTo('#list-profession');
        professionsColec.fetch();
        //this.renderCollectionReset(professionsColec);
      }else{
          var fields='NaN';
          var table='NaN';
          var w = 'NaN';
          var listCollection = new Collection();
          listCollection.url = '/professions/me/'+w+'/'+fields+'/'+table+'/resultarray';
          this.renderCollectionReset(listCollection);
          //var listHtml = (new SearchingView({collection:listCollection})).render().el;
          //$(listHtml).appendTo("#show-list-professions");
          listCollection.fetch();
      }
    },
    render: function(resultList) {
      //this.$el.html(_.template(professionTemplate));
      return this;
    }
  });
  return professionsView;
});