//@project: Auto-Timetabler
//@author: jpillora
//@date: 15/6/2012
//
//Subject classes
$(function(){
  
  //Private helpers
  var log = function(sub, str) { console.log("Subject: " + sub.id + ": " + str); };
  
  window.Subject = Backbone.Model.extend({
    initialize: function() {
      if (!this.get("summary")) this.set({"summary": "COMP9321 Web Applications"});
      if (!this.get("description")) this.set({"description": "An interesting course on the interwebs."});
      
      this.classes = new ClassList();
      this.classes.localStorage = new Store("class-backbone-from-"+this.get('name'));
    },
    clear: function(opts) {
      while(this.classes.length) {
        this.classes.first().clear({silent: true}); 
      }
      this.destroy(opts);
    }
  });

  window.SubjectList = Backbone.Collection.extend({
    model: Subject,
    initialize: function() {},
    localStorage: new Store("subject-backbone")
  });
  
  //Singleton app-wide instance
  window.subjects = new SubjectList();
  
  window.SubjectView = Backbone.View.extend({
    tagName:  "div",

    // Cache the template function for a single item.
    subjectTemplate: _.template($('#subject-template').html()),
    classHeadingTemplate: _.template($('#class-heading-template').html()),
     
    events: {
      "click .remove":  "clear",
      "click .create":  "createOne"
    },
    
    initialize: function () {
      
      _.bindAll(this);
      
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.animRemove, this);
      
      this.model.classes.bind('add', this.addOne, this);
      this.model.classes.bind('reset', this.addAll, this);
      //this.model.classes.bind('all', this.render, this);
      
      this.editor = this.$(".edit").hide();
      this.classTable = $("<table/>").append(this.classHeadingTemplate());
      this.model.classes.fetch();
    },
    
    render: function() {
      log(this.model,"Render View");
      this.$el.addClass("subject");
      this.$el.html(this.subjectTemplate(this.model.toJSON()));
      this.$(".list").append(this.classTable);
      this.renderButtons();
      this.renderEditables(this.saveEditables);
      return this;
    },
    
    addOne: function(cl) {
      var v = new ClassView({model: cl});
      var e = v.render().$el;
      e.find(">td>div").hide();
      this.classTable.append(e);
      e.find(">td>div").slideDown('slow');
    },

    addAll: function() {
      this.model.classes.each(this.addOne);
    },

    createOne: function() {
      log(this.model,"Create one Class");
      this.model.classes.create({  location: "class-from-"+this.model.get('name') },{wait: true});
    },
    
    saveEditables: function(obj) {
      log(this.model, "Save to model: " + JSON.stringify(obj));
      this.model.save(obj);
    },
    
    // Remove the item, destroy the model.
    clear: function(e) {
      log(this.model,"Remove");
      e.stopImmediatePropagation();
      this.model.clear();
    },
    
    animRemove: function() {
      this.$el.slideUp('slow', function() {
        $(this).remove();
      })
    }
    
  });
  
  
});