$(function() {
	console.log('working' + $(window).height());

	var scrollerArea = $('.scroller_area'),
		contentContainer = $('.content_container'),
		sections = $('section'),
		distanceForOnePage = $(window).height()/1,
		activePage = 0,
		body = $("body"),
		snapsToPage = true;

	if(snapsToPage) {
		$('body').addClass('snaps snapped');
	}
	console.log('y');

	var resizeScroller = function() {
		scrollerArea.height(sections.length *  distanceForOnePage);
	}
	var renderPage = function(scrollX,scrollY) {
			globalScroll = (scrollY+distanceForOnePage/2) / distanceForOnePage,
			activePageScroll = (globalScroll - activePage - 0.5);

		sections.removeClass('active left right left-outside right-outside');

		transitionScrollX(activePage, activePageScroll);
		//transitionFade(activePage, activePageScroll);
		//transitionCubeX(activePage, activePageScroll);
		//transitionCubeY(activePage, activePageScroll);


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
			'transform-style': 'preserve-3d'
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
		$('body').addClass('scrolling');
		$('body').removeClass('snapped');
		activePage = parseInt((scrollY+distanceForOnePage/2) / distanceForOnePage);
		if($(body).scrollTop() < 0) {
			$(body).scrollTop(0);
			console.log('top');
		}
		if($(body).scrollTop() > $(body).height() - $(window).height()) {
			$(body).scrollTop($(body).height());
			console.log('bottom');
		}
		renderPage($(window).scrollLeft(), $(window).scrollTop());
	});

	$(document).on('scroll', function(event) {
		foo = event;
		//console.log(event.type, $(body).scrollTop(), activePage * distanceForOnePage -1.5, $(body).scrollTop() < activePage * distanceForOnePage-1.5, $(body).scrollTop() > activePage * distanceForOnePage + 1.5);
		if(snapsToPage) {
			clearTimeout($.data(this, 'scrollTimer'));
		    $.data(this, 'scrollTimer', setTimeout(function() {
		    	if($(body).scrollTop() < activePage * distanceForOnePage -1.5 || $(body).scrollTop() > activePage * distanceForOnePage + 1.5) {
					body.animate({scrollTop: activePage * distanceForOnePage }, 200, 'swing', function() {
						body.stop();
						body.scrollTop(activePage * distanceForOnePage);
						$(document).scrollTop(activePage * distanceForOnePage);
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
	});


	renderPage(0,0);
	resizeScroller();
});