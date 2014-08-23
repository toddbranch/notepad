var App = {
	Models: {}
	, Views: {}
	, Collections: {}
	, Events: {}
};

App.Events.Aggregator = {};

_.extend(App.Events.Aggregator, Backbone.Events);

App.Models.Note = Backbone.Model.extend({
	defaults: {
		title: 'Title!'
		, body: 'Body!'
	}
});

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
		var notesView = new App.Views.NotesView({ collection: this.notes });
		this.$main.append(notesView.render().el);

		var editView = new App.Views.EditView();
		this.$main.append(editView.render().el);
	}
});

App.Views.NotesView = Backbone.View.extend({
	initialize: function(opts) {
		this.listenTo(this.collection, 'change', this.render);
		this.listenTo(this.collection, 'add', this.render);
	}
	, className: 'noteListColumn'
	, events: {
		'click a': 'newNote'
	}
	, template: _.template($('#notesViewTemplate').html())
	, render: function() {
		console.log('rendering!');
		this.el.innerHTML = this.template();
		this.collection.forEach(function(model) {
			var titleView = new App.Views.NoteTitleView({ model: model });
			this.$el.append(titleView.render().el)
		}, this);

		return this;
	}
	, newNote: function() {
		var newNote = new App.Models.Note();
		this.collection.add(newNote);
		console.log('new note!');
	}
});

App.Views.NoteTitleView = Backbone.View.extend({
	events: {
		'click': 'showNote'
		, 'dblclick': 'editTitle'
		, 'blur': 'saveTitle'
	}
	, className: 'title'
	, template: _.template($('#titleViewTemplate').html())
	, render: function() {
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	}
	, showNote: function() {
		App.Events.Aggregator.trigger('showNote', this.model);
	}
	, editTitle: function() {
		console.log('edit title!');
		this.$el.attr("contenteditable", "true");
	}
	, saveTitle: function() {
		console.log('saving title!');
		this.model.save({ title: this.$el.text()});
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
		App.Events.Aggregator.trigger('saveNote');
	}
});

App.Views.NoteView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(App.Events.Aggregator, 'showNote', this.render);
		this.listenTo(App.Events.Aggregator, 'saveNote', this.saveNote);
		this.$el.attr("contenteditable", "true");
	}
	, className: "editArea"
	, render: function(note) {
		console.log(note);
		if (note) {
			this.note = note;
			this.$el.html(note.get('body'));
		}
		return this;
	}
	, saveNote: function() {
		console.log('saving!');
		this.note.save( {body: this.$el.html()} );
	}
});

//////////////////////////////////////////

var notes = new App.Collections.Notes();
notes.fetch({success: function() {
	App.Events.Aggregator.trigger('showNote', notes.first());
}});

var appView = new App.Views.AppView({ main: $('#container'), notes: notes });

appView.render();
