$(function($)	 {
	var updateSocial = function(url, numSocial) {
		var $newBadge = $('#socialLink').find('.new-badge'), currentNew = parseInt($newBadge.text(), 10);
		socialList.fetch({
			url: url,
			success: function(data) {
				// there has to be a better way to do this, but backbone doesn't like it when you update with a new url
				// TODO: investigate further. for now, though, this works nicely
				socialView.render();
				$newBadge.text(currentNew + numSocial).show();
		}});
	};
	// pass in URL of new file, plus the number of new SMSs in this batch
	var updateText = function(url, numSMS) {
		var $textList = $('#textList li');
		var unreadTexts = [], unreadCount = numSMS;
		$textList.each(function() {
			// for each person, go through and determine which people still have unread texts, and how many
			var $text = $(this);
			if ( $text.hasClass("new") ) { // still unread
				unreadTexts.push([$text.attr("data-name"), $text.attr("data-numnew")]);
				unreadCount = unreadCount + parseInt($text.attr("data-numnew"), 10);
			}
		});
		var activeID = "", $visibleText = $('#textsHistory').find('.texts:visible');
		// we want to save which text view you're currently looking at, if any, so we don't pull the ol' switcheroo on the player later
		if ( $visibleText.length > 0 ) {
			activeID = $visibleText.attr("id");
		}
		personList.fetch({
			url: url,
			success: function(data) {
				// TODO: swap this out for something nicer, if possible
				personView.render();
				if ( activeID != "" ) { // this is only if we're currently on text mode
					$('#' + activeID).show();
					$('#textList').hide();
				}
				$textList = $('#textList li');
				$textList.each(function() {
					// now that it's updated, for each person in the list, we have to go back through and add on the previously unread texts
					// so, if you had 2 unread for a person, then we've updated that person with 2 more, he/she should have 4 displayed, not 2
					var $text = $(this);
					for ( var i = 0; i < unreadTexts.length; i++ ) {
						// if our person is in our previously stored array
						if ( unreadTexts[i][0] == $text.text() ) {
							if ( $text.hasClass("new") ) { // it's got new posts, so update with the value stored in unreadTexts
								var textCount = $text.attr('data-numnew');
								$text.attr('data-numnew').text(textCount + unreadTexts[i][1]);
							}
							else { // no new posts, so just make sure we add on the value stored in unreadTexts without adding
								$text.addClass("new");
								$text.attr('data-numnew').text(unreadTexts[i][1]);
							}
						}
					}
				});
				// now that we've gone through and calculated all the unreads, make sure to add on the NEW badge to the SMS button
				if ( unreadCount > 0 ) {
					$('#smsLink').find('.new-badge').text(unreadCount).show();
				}
		}});
	};
	// pass in URL of new file
	var updateFeed = function(url) {
		var $feedList = $('.feed-list li');
		// first, which feed is being shown
		var activeFeed = $feedList.find('.active').attr("data-name") + "feed";
		// which feeds are unread yet?
		// same thing as SMS - if we have unread feeds and we update it, we need to keep track of that
		var unreadFeeds = [];
		$feedList.find('a').each(function() {
			var $feed = $(this), $badge = $feed.find('.new-badge');
			// TODO: this is kind of gross/unreadable, let's clean it up later
			// all it's doing is finding out if the feed has unread posts
			if ( $feed.find('.new-badge:visible').length > 0 && $badge.text() != "0" && $badge.text() != "" ) {
				// push on the class of the unread feed and the # of unread posts
				unreadFeeds.push([$feed.attr("class"), $badge.text().substring(0, $badge.text().indexOf(" "))]);
			}
		});
		feedList.fetch({
			url: url,
			success: function(data) {
				// TODO: replace this with something nicer, if possible
				feedView.render();
				$('.feed-list li a.active').removeClass("active");
				$('.feed-list li a.' + activeFeed).addClass('active');
				// update the badges with unread values
				for ( var i = 0; i < unreadFeeds.length; i++ ) {
					var $newBadge = $('.' + unreadFeeds[i][0]).find('.new-badge'), numNew = parseInt($newBadge.text().substring(0, $newBadge.text().indexOf(" ")), 10);
					$newBadge.show().text(parseInt(unreadFeeds[i][1], 10) + numNew + " New");
				}
		}});
	};


	/* begin story */
	// create router
	var Router;
	Router = Backbone.Router.extend({
		routes: {
			'': 'chapter0',
			'troubles': 'chapter1',
			'chapter2': 'chapter2'
		},
		
		chapter0: function() {
			$('#smsLink').on('click.chapter0', function() {
				// update necessary junk
				updateSocial("js/storyfiles/social2.json", 3);
				// unbind this event
				$(this).off('click.chapter0');
				// bind new event
				$('.localNewsfeed').attr("data-event", "2" );
				router.navigate("chapter1");
			});
			$('.localNewsfeed').on('click', function() {
				if ( $(this).attr("data-event") == "2" ) {
					// update necessary junk
					updateText("js/storyfiles/texts2.json", 2);
					// unbind this event
					$(this).removeAttr("data-event").off('click');
					// bind new event
					$('#socialLink').attr("data-event", "3" );
				}
			});
		},
		
		chapter1: function() {
			$('#smsLink').on('click', function() {
				if ( $(this).attr("data-event") == "newFeed" ) {
					// update necessary junk
					updateSocial("js/storyfiles/social2.json", 2);
					// unbind this event
					$(this).removeAttr("data-event").off('click');
					// bind new event
					$('#socialLink').attr("data-event", "newSocial" );
					router.navigate("chapter2");
				}
			});
		},
		
		chapter2: function() {
			$('#socialLink').on('click.chapter2', function() {
				if ( $(this).attr("data-event") == "newSocial" ) {
					updateText("js/storyfiles/texts2.json", 2);
					$(this).removeAttr("data-event");
				}
			});
		}
	});

	var router = new Router();
	Backbone.history.start();
});