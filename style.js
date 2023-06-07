// Scrolling Navbar 
$(function () {
	$(document).scroll(function () {
		var $nav = $(".bg-navbar");
		$nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
	});
});

// Text Typing Effects
var aText = new Array(
	"ยินดีต้อนรับเข้าสู่เว็บไซต์ Portfolio ของผมนะครับในเว็บไซต์นี้ผมได้รวบรวมผลงานเกี่ยวกับการออกแบบและการสร้างเว็บไซต์ตลอดปีการศึกษาในมหาวิทยาลัยศิลปากรครับ"
);
var iSpeed = 70; // time delay of print out
var iIndex = 0; // start printing array at this posision
var iArrLength = aText[0].length; // the length of the text array
var iScrollAt = 20; // start scrolling up at this many lines

var iTextPos = 0; // initialise text position
var sContents = ''; // initialise contents variable
var iRow; // initialise current row

function typewriter() {
	sContents = ' ';
	iRow = Math.max(0, iIndex - iScrollAt);
	var destination = document.getElementById("typedtext");

	while (iRow < iIndex) {
		sContents += aText[iRow++] + '<br />';
	}
	destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "<span class='blink-caret'></span>";
	if (iTextPos++ == iArrLength) {
		iTextPos = 0;
		iIndex++;
		if (iIndex != aText.length) {
			iArrLength = aText[iIndex].length;
			setTimeout("typewriter()", 500);
		}
	} else {
		setTimeout("typewriter()", iSpeed);
	}
}

typewriter();


// Animation Reveal Scrolling
gsap.registerPlugin(ScrollTrigger);
// REVEAL //
gsap.utils.toArray(".revealUp").forEach(function (elem) {
	ScrollTrigger.create({
		trigger: elem,
		start: "top 80%",
		end: "bottom 20%",
		markers: false,
		onEnter: function () {
			gsap.fromTo(
				elem,
				{ y: 100, autoAlpha: 0 },
				{
					duration: 1.25,
					y: 0,
					autoAlpha: 1,
					ease: "back",
					overwrite: "auto"
				}
			);
		},
		onLeave: function () {
			gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
		},
		onEnterBack: function () {
			gsap.fromTo(
				elem,
				{ y: -100, autoAlpha: 0 },
				{
					duration: 1.25,
					y: 0,
					autoAlpha: 1,
					ease: "back",
					overwrite: "auto"
				}
			);
		},
		onLeaveBack: function () {
			gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
		}
	});
});

//jquery zoom

(function ($) {
	var defaults = {
		url: false,
		callback: false,
		target: false,
		duration: 120,
		on: 'click', // other options: grab, click, toggle, mouseover
		touch: true, // enables a touch fallback
		onZoomIn: false,
		onZoomOut: false,
		magnify: 1
	};

	// Core Zoom Logic, independent of event listeners.
	$.zoom = function (target, source, img, magnify) {
		var targetHeight,
			targetWidth,
			sourceHeight,
			sourceWidth,
			xRatio,
			yRatio,
			offset,
			$target = $(target),
			position = $target.css('position'),
			$source = $(source);

		// The parent element needs positioning so that the zoomed element can be correctly positioned within.
		target.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
		target.style.overflow = 'hidden';
		img.style.width = img.style.height = '';

		$(img)
			.addClass('zoomImg')
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				opacity: 0,
				width: img.width * magnify,
				height: img.height * magnify,
				border: 'none',
				maxWidth: 'none',
				maxHeight: 'none'
			})
			.appendTo(target);

		return {
			init: function () {
				targetWidth = $target.outerWidth();
				targetHeight = $target.outerHeight();

				if (source === target) {
					sourceWidth = targetWidth;
					sourceHeight = targetHeight;
				} else {
					sourceWidth = $source.outerWidth();
					sourceHeight = $source.outerHeight();
				}

				xRatio = (img.width - targetWidth) / sourceWidth;
				yRatio = (img.height - targetHeight) / sourceHeight;

				offset = $source.offset();
			},
			move: function (e) {
				var left = (e.pageX - offset.left),
					top = (e.pageY - offset.top);

				top = Math.max(Math.min(top, sourceHeight), 0);
				left = Math.max(Math.min(left, sourceWidth), 0);

				img.style.left = (left * -xRatio) + 'px';
				img.style.top = (top * -yRatio) + 'px';
			}
		};
	};

	$.fn.zoom = function (options) {
		return this.each(function () {
			var
				settings = $.extend({}, defaults, options || {}),
				//target will display the zoomed image
				target = settings.target && $(settings.target)[0] || this,
				//source will provide zoom location info (thumbnail)
				source = this,
				$source = $(source),
				img = document.createElement('img'),
				$img = $(img),
				mousemove = 'mousemove.zoom',
				clicked = false,
				touched = false;

			// If a url wasn't specified, look for an image element.
			if (!settings.url) {
				var srcElement = source.querySelector('img');
				if (srcElement) {
					settings.url = srcElement.getAttribute('data-src') || srcElement.currentSrc || srcElement.src;
				}
				if (!settings.url) {
					return;
				}
			}

			$source.one('zoom.destroy', function (position, overflow) {
				$source.off(".zoom");
				target.style.position = position;
				target.style.overflow = overflow;
				img.onload = null;
				$img.remove();
			}.bind(this, target.style.position, target.style.overflow));

			img.onload = function () {
				var zoom = $.zoom(target, source, img, settings.magnify);

				function start(e) {
					zoom.init();
					zoom.move(e);

					// Skip the fade-in for IE8 and lower since it chokes on fading-in
					// and changing position based on mousemovement at the same time.
					$img.stop()
						.fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn) ? settings.onZoomIn.call(img) : false);
				}

				function stop() {
					$img.stop()
						.fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false);
				}

				// Mouse events
				if (settings.on === 'grab') {
					$source
						.on('mousedown.zoom',
							function (e) {
								if (e.which === 1) {
									$(document).one('mouseup.zoom',
										function () {
											stop();

											$(document).off(mousemove, zoom.move);
										}
									);

									start(e);

									$(document).on(mousemove, zoom.move);

									e.preventDefault();
								}
							}
						);
				} else if (settings.on === 'click') {
					$source.on('click.zoom',
						function (e) {
							if (clicked) {
								// bubble the event up to the document to trigger the unbind.
								return;
							} else {
								clicked = true;
								start(e);
								$(document).on(mousemove, zoom.move);
								$(document).one('click.zoom',
									function () {
										stop();
										clicked = false;
										$(document).off(mousemove, zoom.move);
									}
								);
								return false;
							}
						}
					);
				} else if (settings.on === 'toggle') {
					$source.on('click.zoom',
						function (e) {
							if (clicked) {
								stop();
							} else {
								start(e);
							}
							clicked = !clicked;
						}
					);
				} else if (settings.on === 'mouseover') {
					zoom.init(); // Preemptively call init because IE7 will fire the mousemove handler before the hover handler.

					$source
						.on('mouseenter.zoom', start)
						.on('mouseleave.zoom', stop)
						.on(mousemove, zoom.move);
				}

				// Touch fallback
				if (settings.touch) {
					$source
						.on('touchstart.zoom', function (e) {
							e.preventDefault();
							if (touched) {
								touched = false;
								stop();
							} else {
								touched = true;
								start(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
							}
						})
						.on('touchmove.zoom', function (e) {
							e.preventDefault();
							zoom.move(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
						})
						.on('touchend.zoom', function (e) {
							e.preventDefault();
							if (touched) {
								touched = false;
								stop();
							}
						});
				}

				if ($.isFunction(settings.callback)) {
					settings.callback.call(img);
				}
			};

			img.setAttribute('role', 'presentation');
			img.alt = '';
			img.src = settings.url;
		});
	};

	$.fn.zoom.defaults = defaults;
}(window.jQuery));


