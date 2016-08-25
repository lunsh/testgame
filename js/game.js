
// Create a model for the texts
var Person = Backbone.Model.extend();

// Create a collection of texts
var PersonList = Backbone.Collection.extend({
	model: Person,
	url: 'js/storyfiles/texts.json'
});
// there are two text templates, so we can have the list and the display
var PersonView = Backbone.View.extend({
	template0: Handlebars.compile($('#text-preview-template').html()),
    template1: Handlebars.compile($('#texts-template').html()),
	initialize: function() {
		// set up our listener for the reset, then call it
		this.listenTo(this.collection, 'reset', this.render);
		this.collection.fetch({reset: true}); 
	},
	
	render: function() {
		var models = this.collection.models;
		// create some new elements
		this.$el0 = $('<ul></ul>');
		this.$el1 = $('<div></div>');
		
		// render each model using two templates
		for (var i = 0; i < models.length; i++) {
			this.$el0.append(this.template0(models[i].attributes));
			this.$el1.append(this.template1(models[i].attributes));
		}
		// render the templates into the div elements
		$('#textList').html(this.$el0);
		$('#textsHistory').html(this.$el1);
		return this;
	}
});

// Model for Social
var SocialPost = Backbone.Model.extend();
// Create a collection of SocialPosts
var SocialList = Backbone.Collection.extend({
	model: SocialPost,
	url: 'js/storyfiles/social.json'
});
// Create our SocialView 
var SocialView = Backbone.View.extend({
	template: Handlebars.compile($('#social-template').html()),
	tagName: 'ul',
	initialize: function() {
		// set up our listener for the reset, then call it
		this.listenTo(this.collection, 'reset', this.render);
		this.collection.fetch({reset: true}); 
	},
	
	render: function() {
		var models = this.collection.models;
		this.$el.empty();
		for (var i = 0; i < models.length; i++) {
			this.$el.append(this.template(models[i].attributes));
		}
		return this;
	}
});

// Model for Feeds
var FeedPosts = Backbone.Model.extend();
// Create a collection of FeedPosts
var FeedList = Backbone.Collection.extend({
	model: FeedPosts,
	url: 'js/storyfiles/feeds.json'
});
// Create our FeedView 
var FeedView = Backbone.View.extend({
	template0: Handlebars.compile($('#feeds-template').html()),
    template1: Handlebars.compile($('#posts-template').html()),
	initialize: function() {
		// set up our listener for the reset, then call it
		this.listenTo(this.collection, 'reset', this.render);
		this.collection.fetch({reset: true}); 
	},
	
	render: function() {
		var models = this.collection.models;
		// set up elements
		this.$el0 = $('<ul class="feed-list"></ul>');
		this.$el1 = $('<div></div>');
		
		// render each model using two templates
		for (var i = 0; i < models.length; i++) {
			this.$el0.append(this.template0(models[i].attributes));
			this.$el1.append(this.template1(models[i].attributes));
		}
		$('#feedList').html(this.$el0);
		$('#readPosts').html(this.$el1);
		return this;
	}
});

$(function(){
	// initialize our objects and views
	window.personList = new PersonList();
	window.socialList = new SocialList();
	window.feedList = new FeedList();
	window.personView = new PersonView({
		collection: personList
	});
	window.socialView = new SocialView({
		collection: socialList
	});
	window.feedView = new FeedView({
		collection: feedList
	});
	// render social
	// TODO: probably make this more consistent with the others
	$('#social .social-inner').html(socialView.render().el);
});