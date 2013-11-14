define(['SocialNetView', 'text!templates/profession/listprofession.html'],
  function(SocialNetView, ProfessionTemplate, ProfessionView) {
  var professionView = SocialNetView.extend({
    myTarget  : '',
    isDraggable:false,
    tagName   : 'li',
    className : '',
    initialize: function(options) {
      this.model.bind('change', this.render, this);
    },
    setupDrop: function(){
      var that = this;
      $('#p-profesions').droppable({
        accept: '.profession-li',
        activeClass:'ui-state-drop-profession',
        drop: function(event,ui){
          var draggable = ui.draggable;
          var isProfession = draggable.hasClass('profession-li');
          if(isProfession){
            that.deleteProfession(draggable,'#p-profesions ul');
          }
        }
      });
    },
    deleteProfession: function(item,theDropped){
      item.css({left:'0px',top:'0px',width:'40%', border:'none', height:'60px'});
      item.fadeOut(function() {
        item.appendTo(theDropped).fadeIn(function(){
          item.addClass('shake delete').removeClass('profession-li');

          var id = item.attr('id');
          var parameter = {
            _id: id
          }
          $.post('/accounts/me/savemyprofession',{
              parameter: parameter,
              collection: 'professions'
          });
        });
      });

    },
    render: function() {

      if(this.model.get('_id')!=undefined){
        this.$el.html(_.template(ProfessionTemplate,{
          model:this.model.toJSON()
        }));
        if(this.options.isDraggable){
          $(this.$el.html()).appendTo(this.options.myTarget).hide().fadeIn('slow');

          $('.profession-li').draggable({revert:'invalid'});
          this.setupDrop(); //Configurar el Drop
        }else
        {
          $(this.$el.html()).addClass('shake delete').removeClass('profession-li').appendTo(this.options.myTarget).hide().fadeIn('slow');

        }
      }
      return this;
    }
  });
  return professionView;
});