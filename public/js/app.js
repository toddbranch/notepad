var App = {
	Models: {}
	, Views: {}
	, Collections: {}
};

App.Models.Note = Backbone.Model.extend({});

App.Collections.Notes = Backbone.Collection.extend({
	model: App.Models.Note
	, url: '/notes'
});

App.Views.AppView = Backbone.View.extend({
	initialize: function(opts) {
		this.$main = opts.main;
		this.notes = opts.notes;
	}
	, render: function() {
		var editView = new App.Views.EditView();
		var notesView = new App.Views.NotesView({ collection: this.notes, editView: editView });

		this.$main.append(notesView.render().el);
		this.$main.append(editView.render().el);
	}
});

App.Views.NotesView = Backbone.View.extend({
	initialize: function(opts) {
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(this.collection, 'add', this.render);
		this.editView = opts.editView;
	}
	, className: 'noteListColumn'
	, render: function() {
		console.log('rendering!');
		this.el.innerHTML = "";
		this.collection.forEach(function(model) {
			var titleView = new App.Views.NoteTitleView({ model: model, editView: this.editView });
			this.$el.append(titleView.render().el)
		}, this);
		return this;
	}
});

App.Views.NoteTitleView = Backbone.View.extend({
	initialize: function(opts) {
		this.editView = opts.editView;
	}
	, events: {
		'click': 'showNote'
	}
	, className: 'title'
	, template: _.template($('#titleViewTemplate').html())
	, render: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	}
	, showNote: function() {
		// NEED TO CHANGE ALL THIS CODE - EDIT VIEW SHOULD LISTEN FOR AN EVENT THAT GETS TRIGGERED BY THIS!!!
		console.log('clicked!');
		console.log(this.editView.$el);
		this.editView.$el.val(this.model.body);
	}
});

App.Views.EditView = Backbone.View.extend({
	className: 'editColumn'
	, events: {
		'click a': 'save'
	}
	, template: _.template($('#editViewTemplate').html())
	, render: function() {
		this.el.innerHTML = this.template();
		var noteView = new App.Views.NoteView();
		this.$el.append(noteView.render().el);
		return this;
	}
	, save: function(e) {
		e.preventDefault();
		console.log('save!');
	}
});

App.Views.NoteView = Backbone.View.extend({
	className: "editArea"
	, render: function() {
		this.$el.attr("contenteditable", "true");
		return this;
	}
});

//////////////////////////////////////////

var notes = new App.Collections.Notes();
notes.fetch();

var appView = new App.Views.AppView({ main: $('#container'), notes: notes });

appView.render();
