//@project: Auto-Timetabler
//@author: jpillora
//@date: 15/6/2012
//
//App classes
$(function(){
  
  //Private helpers
  var log = function(str) { console.log("App: " + str); };
  
  window.AppView = Backbone.View.extend({
    el: $("#app"),
    
    events: {
      "click #createSub":  "createOne"
    },
    
    initialize: function() {
      window.subjects.bind('add', this.addOne, this);
      window.subjects.bind('reset', this.addAll, this);
      window.subjects.bind('all', this.render, this);
      window.subjects.fetch();
    },

    render: function() {
      log("Render View");
    },

    addOne: function(subject) {
      var view = new SubjectView({model: subject});
      this.$("#subject-list").append(view.render().el);
    },
    addAll: function() {
      window.subjects.each(this.addOne);
    },
    createOne: function() {
      log("Create one Subject");
      window.subjects.create({ name: "subject-"+window.guid() });
    },

  });
  
  window.appView = new AppView();
});