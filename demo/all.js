$(function() {
	console.log('working' + $(window).height());

	var scrollerArea = $('.scroller_area'),
		scrollAreas = [],
		scrollArea,
		contentContainer = $('.content_container'),
		sections = $('section'),
		distanceForOnePage = $(window).height(),
		activePage = 0,
		body = $("body"),
		snapsToPage = true;

	if(snapsToPage) {
		$('body').addClass('snaps snapped');
	}
	var scrollArea = function(start, end, section, type) {
		this.start = start;
		this.end = end;
		this.type = type;
		this.section = section;
	};

	var activeScrollArea = function(scrollY) {
		for(var i = 0; i < scrollAreas.length; i++) {
			if((scrollY < 0 || scrollY >= scrollAreas[i].start) && scrollY < scrollAreas[i].end) {
				console.log(scrollY);
				return scrollAreas[i];
			}
		}
		return "error in calculation";
	};

  var getSnapPosition = function(activePage) {
    for(var i = 0; i < scrollAreas.length; i++) {
      console.log(scrollAreas[i].section, scrollAreas[i].type, activePage);
      if(scrollAreas[i].section == activePage) {
        if(scrollAreas[i].type == 'content') {
          return scrollY > scrollAreas[i].start ? scrollAreas[i].end : scrollAreas[i].start;
        }
        else {
          return scrollAreas[i].start;
        }
      }
    }
    return "error";
  }

	var resizeScroller = function() {

		var calcPosition = 0;
      contentHeight = 0;

		scrollAreas = [];

		sections.each(function(i) {
			var contentOffset = $(this).find('.content').outerHeight() - $(this).outerHeight() > 0 ? $(this).find('.content').outerHeight() -$(this).outerHeight() : 0,
        contentStart = calcPosition,
        contentEnd = contentOffset > 0 ? contentStart + contentOffset : contentStart,
        transitionStart = contentEnd,
				transitionEnd = transitionStart + distanceForOnePage;

      if(contentOffset > 0 ) {
        var contentArea = new scrollArea(contentStart, contentEnd, i, "content");
        scrollAreas.push(contentArea);
        contentHeight = contentHeight + contentOffset;
      }

			var transitionArea = new scrollArea(transitionStart, transitionEnd, i, "transition");
			scrollAreas.push(transitionArea);

			calcPosition = transitionEnd;
		});

    scrollerArea.height(sections.length *  distanceForOnePage + contentHeight);

		console.log(scrollAreas);
		console.log('Number of Sections ' + sections.length, 'distanceForOnePage ' + distanceForOnePage);
	}

	var renderPage = function(scrollX,scrollY, activeArea) {
			globalScroll = (scrollY+distanceForOnePage/2) / distanceForOnePage,
			activePageScroll = activeArea ? (scrollY - activeArea.start) / distanceForOnePage : 0;

    //console.log("old", globalScroll - activePage);
    //console.log("new", activeArea ? (scrollY - activeArea.start) / distanceForOnePage : 0);

    console.log(activeArea.type, activePageScroll);

    var contentTop = 0;

    if(activeArea.type == "content") {
      activePageScroll = 0;
      contentTop = activeArea.start - scrollY;
      contentScroll(activeArea.section, contentTop);

      console.log("AAST", activeArea.start, scrollY);
    }


		sections.removeClass('active left right left-outside right-outside');

    //transitionCubeY(activeArea.section, activePageScroll);


		//transitionScrollX(activeArea.section, activePageScroll);
		//transitionFade(activeArea.section, activePageScroll);
		transitionCubeX(activeArea.section, activePageScroll);


	}

  var contentScroll = function (activePage, activePageScroll) {
    $(sections[activePage]).find('.content').css({'top':activePageScroll, 'bottom': 'initial'});
    $(sections[activePage-1]).find('.content').css({'top': 'initial','bottom': 0});
    $(sections[activePage+1]).find('.content').css({'top': 0,'bottom': 'initial'});
  }

	var transitionFade = function(activePage, activePageScroll) {

		$(sections[activePage]).addClass('active').css('opacity', activePageScroll + 1);

		$(sections[activePage-1]).addClass('left').css('opacity', '1');
		$(sections[activePage-2]).addClass('left-outside');
		$(sections[activePage+1]).addClass('right').css('opacity', activePageScroll);
		$(sections[activePage+2]).addClass('right-outside');
	}

	var transitionScrollX = function(activePage, activePageScroll) {

		$(sections[activePage]).addClass('active').css('left', activePageScroll * -100 + "%");

		$(sections[activePage-1]).addClass('left').css('left', (activePageScroll * -100 - 100) + "%");
		$(sections[activePage-2]).addClass('left-outside');
		$(sections[activePage+1]).addClass('right').css('left', (activePageScroll * -100 + 100) + "%");
		$(sections[activePage+2]).addClass('right-outside');
	}

	var transitionCubeX = function(activePage, activePageScroll) {
		contentContainer.find('.content_wrapper').css({
			'transform': 'translate3d(0,0,' + $(window).width() / -2 + 'px)',
			'height': '100%',
			'transform-style': 'preserve-3d',
			'backface-visibility': 'hidden'
		});
		$(sections[activePage]).addClass('active').css({
			'transform': 'rotateY(' + -90*activePageScroll+ 'deg) translate3d(0,0,' + $(window).width() / 2 +'px)',
			'opacity': 1
		});

		$(sections[activePage-1]).addClass('left').css({
			'transform': 'rotateY(' + (-90*activePageScroll - 90)+ 'deg) translate3d(0,0,' + $(window).width() / 2 +'px)',
			'opacity':  -activePageScroll*2
		});
		$(sections[activePage-2]).addClass('left-outside');
		$(sections[activePage+1]).addClass('right').css({
			'transform': 'rotateY(' + (-90*activePageScroll +90)+ 'deg) translate3d(0,0,' + $(window).width() / 2 +'px)',
			'opacity': activePageScroll*2
		});
		$(sections[activePage+2]).addClass('right-outside');
	}

	var transitionCubeY = function(activePage, activePageScroll) {
		contentContainer.find('.content_wrapper').css({
			'transform': 'translate3d(0,0,' + $(window).height() / -2 + 'px)',
			'height': '100%'
		});
		$(sections[activePage]).addClass('active').css({
			'transform': 'rotateX(' + 90*activePageScroll+ 'deg) translate3d(0,0,' + $(window).height() / 2 +'px)',
			'opacity': 1
		});

		$(sections[activePage-1]).addClass('left').css({
			'transform': 'rotateX(' + -(-90*activePageScroll - 90)+ 'deg) translate3d(0,0,' + $(window).height() / 2 +'px)',
			'opacity':  -activePageScroll*2
		});
		$(sections[activePage-2]).addClass('left-outside');
		$(sections[activePage+1]).addClass('right').css({
			'transform': 'rotateX(' + -(-90*activePageScroll +90)+ 'deg) translate3d(0,0,' + $(window).height() / 2 +'px)',
			'opacity': activePageScroll*2
		});
		$(sections[activePage+2]).addClass('right-outside');
	}

	$(window).on('resize', function() {
		resizeScroller();
		distanceForOnePage = $(window).height()
	});

	$(document).scroll(function(event) {
		//resizeScroller();

		var activeArea = activeScrollArea(scrollY);

    console.log(activeScrollArea(scrollY), scrollY);

		$('body').addClass('scrolling');
		$('body').removeClass('snapped');

    if(activeArea.type == "content") {
      activePage = activeArea.section;
    }
    if(activeArea.type == "transition") {
      var breakpoint = activeArea.start + distanceForOnePage/2;
      console.log('breakpoint' + breakpoint, 'scrollY' + scrollY);
      if(scrollY < breakpoint) {
        console.log('a1');
        activePage = activeArea.section
      }
      else {
        activePage = activeArea.section + 1;
        console.log('a2');
      }

      if(snapsToPage) {
        clearTimeout($.data(this, 'scrollTimer'));
          $.data(this, 'scrollTimer', setTimeout(function() {
            var targetScroll = getSnapPosition(activePage,scrollY);
            console.log('targ' + targetScroll, scrollY);
            if($(body).scrollTop() < targetScroll -1.5 || $(body).scrollTop() > targetScroll + 1.5) {
            body.animate({scrollTop: targetScroll }, 200, 'swing', function() {
              body.stop();
              body.scrollTop(targetScroll);
              $(document).scrollTop(targetScroll);
            });
          }
          else {
            body.stop();
            $('body').addClass('snapped');
            $('body').removeClass('scrolling');
            //console.log('snapped');
          }
        }, 300));
      }
    }

		if($(body).scrollTop() < 0) {
			$(body).scrollTop(0);
		}
		if($(body).scrollTop() > $(body).height() - $(window).height()) {
			$(body).scrollTop($(body).height());
		}
		renderPage($(window).scrollLeft(), $(window).scrollTop(), activeArea);
	});

  $( document ).ready(function() {
    resizeScroller();
  	renderPage(0,0, scrollAreas[0]);
    $('section').addClass('measured');
  });
	//setTimeout(function() { resizeScroller() }, 100);
});