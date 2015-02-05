ActoExplaino.Views.UserLogin = Backbone.View.extend({
  template: JST['users/login'],
  formTemplate: JST['users/form'],
  errTemplate: JST['shared/errors'],

  initialize: function () {
    this.listenTo(this.model, 'sync change', this.render);
  },

  events: {
    'submit #signin': 'signIn',
    'click #signout': 'signOut',
    'click #signupbutton': 'signUp',
    'submit form#signup': 'createUser'
  },

  createUser: function () {
    var that = this;
    event.preventDefault();
    var formData = $(event.target).serializeJSON();
    var user = new ActoExplaino.Models.User(formData);
    user.save({}, {
      success: function () {
        that.$el.find('#signupform').empty();
        that.model.set(user.attributes);
        that.model.activities().set([]);
      },
      error: function (obj, errors) {
        that.renderErrors(errors.responseJSON['errors'], '.uperrors');
      }
    });
  },

  signUp: function () {
    var content = this.formTemplate();
    this.$el.find('#signupform').html(content);
  },

  signIn: function (event) {
    var that = this;
    event.preventDefault();
    var loginData = $(event.target).serializeJSON();
    $.ajax({
      url: 'api/session',
      type: 'POST',
      data: loginData,
      success: function (user) {
        that.model.set(user);
        that.model.activities().set(user.activities);
      },
      error: function (errors) {
        that.renderErrors(errors.responseJSON['errors'], '.inerrors');
      }
    });
  },

  signOut: function (event) {
    var that = this;
    $.ajax({
      url: 'api/session',
      type: 'DELETE',
      success: function () {
        that.model.clear();
      }
    });
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);
    return this;
  },

  renderErrors: function (errors, finding) {
    var content = this.errTemplate({ errors: errors });
    this.$el.find(finding).html(content);
  }
});
