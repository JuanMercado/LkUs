define(['views/index', 'views/register', 'views/login',
        'views/forgotpassword', 'views/profile', 'views/contact/contacts',
        'views/contact/addcontact','views/invitation/invitations', 'models/Account',
        'models/PostsCollection',
        'models/ContactCollection','models/InvitationCollection','models/ProfileHeader'],
function(IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView,
         ContactsView, AddContactView, InvitationView, Account, PostsCollection,
         ContactCollection,InvitationCollection,ProfileModel) {
  var SocialRouter = Backbone.Router.extend({
    currentView: null,

    socketEvents: _.extend({}, Backbone.Events),

    routes: {
      'addcontact': 'addcontact',
      'invitation/:id' : 'invitation',
      'index/:id': 'index',
      'login': 'login',
      'register': 'register',
      'forgotpassword': 'forgotpassword',
      'profile/:id': 'profile',
      'contacts/:id': 'contacts'
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function(id) {
      var contactId = id ? id : 'me';
      if(contactId!=undefined){
        $('#loginForm').hide();
        $('#main').show();
        var postCollection = new PostsCollection();
        postCollection.url = '/accounts/'+contactId+'/posts';
        this.changeView(new IndexView({ collection: postCollection , socketEvents: this.socketEvents }));
        postCollection.fetch();
      }
    },

    addcontact: function() {
      this.changeView(new AddContactView());
    },

    login: function() {
      this.changeView(new LoginView(
        {
          socketEvents:this.socketEvents
        }));
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },
    profile: function(id) {
      var profile = new ProfileModel();
      profile.url = '/accounts/'+id+'/getinfoheader';
      this.changeView(new ProfileView({model:profile,
        socketEvents:this.socketEvents}));
      profile.fetch();
    },
    contacts: function(id) {
      var contactId = id ? id : 'me';
      var contactsCollection = new ContactCollection();
      contactsCollection.url = '/accounts/' + id + '/contacts';
      this.changeView(new ContactsView({
        collection: contactsCollection
      }));
      contactsCollection.fetch();
    },
    invitation: function(id){
      var contactId = id ? id : 'me';
      var invitationCollection = new InvitationCollection();
      invitationCollection.url = '/accounts/' + contactId + '/invitations';
      this.changeView(new InvitationView({
        accountId: 0,
        collection: invitationCollection,
        socketEvents:this.socketEvents
      }));
      invitationCollection.fetch();
    }
  });

  return new SocialRouter();
});

