$(function($)	 {
	/* set up all basic PHONE interactions */
	// clicking into social media
	$('#socialLink').on('click', function() {
		var $social = $('#social');
		// update social button to be active
		$('#phone').find('.active').removeClass("active");
		$(this).parent().addClass("active");
		// show social, hide texts, update the # of new social updates
		$social.show();
		$('#texts').hide();
		$('#socialLink').find('.new-badge').hide().text("0");
		// always scroll to the top because that's how social should work
		$social.find('.social-inner').scrollTop(0);
		return false;
	});
	// clicking into text messages
	$('#smsLink').on('click', function() {
		// update SMS button to be active
		$('#phone').find('.active').removeClass("active");
		$(this).parent().addClass("active");
		// show the text list and hide the drilldown text view, and social
		$('#texts').show();
		$('#textList').show();
		$('.texts').hide();
		$('#social').hide();
		return false;
	});
	// when you click a contact in your SMS list
	$('#textList').on('click', 'li', function() {
		var $this = $(this), $textContainer = $('#texts' + $this.attr("data-name")), $innerText = $textContainer.find('.texts-inner');
		// show the appropriate text list, and scroll to the bottom, because that's how texts work on your phone
		$textContainer.show();
		$innerText.scrollTop($innerText[0].scrollHeight);
		$('#textList').hide();
		// update the little new badge with the new value, or hide it altogether
		if ( $this.hasClass("new") ) {
			$this.removeClass("new");
			var $newBadge = $('#smsLink').find('.new-badge'), newCount = parseInt($newBadge.text(), 10);
			if ( newCount > 0 ) { // decrement by the number of new texts from that person
				newCount = newCount - parseInt($this.attr("data-numnew"), 10);
				$newBadge.text(newCount);
				$this.attr("data-numnew", "0");
			}
			if ( newCount <= 0 ) { // we've hit 0, so no need to show it
				$newBadge.hide();
			}
		}
		return false;
	})
	// when you click the GO button for "replying" to a message
	// this is a little gimmicky - it's just for fun, not really meant to update any data
	$('#textsHistory').on('click', '.display-last', function() {
		var $this = $(this), $innerText = $this.closest(".texts-inner");
		$this.siblings('textarea').val("");
		$this.hide(); // hide the GO button
		// we already have the div containing the last reply, just show it - remember, it's just a fun interaction
		$('#last' + $this.attr("data-name")).show();
		$innerText.scrollTop($innerText[0].scrollHeight);
		return false;
	});


	/* set up all basic FEED interactions */
	$('#feedList').on('click', '.feed-list li a', function(e) {
		var $this = $(this);
		// update the active feed
		$('.feeds a.active').removeClass('active');
		$this.addClass('active');
		// show the appropriate feed
		$('.feed-reader').hide();
		$this.find('.new-badge').hide();
		$('#feed' + $(this).attr("data-name")).show();
		return false;
	});
});

// Handlebars helper, much like hamburger helper but far better
// this one enables list behavior
// use it like this: {{#list posts}}{{/list}}
Handlebars.registerHelper('list', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});

// Here's another flavor of Handlebars Helper
// this one enables a simple if conditional
// use it like this: {{#if isNew}}{{/if}}
Handlebars.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});