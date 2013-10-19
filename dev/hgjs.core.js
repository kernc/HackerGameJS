/**

HackerGame default javascript file

**/
HackerGame = {};
(function ($, hg) {
	var temp1,
		init = function(settings) {
			var jObj = this.terminal(hg.exec, hg.config.terminal);
			if (settings) {
				$.each(settings, function (property, value) {
					hg.config[property] = value;
				});
			}
			hg.refreshTranslations();
			hg.state = new hg.cons.State();
			return jObj;
		};

	// Public methods
	hg.t = function (string) {
		return (hg.lang && hg.lang[string]) || string;
	};
	hg.refreshTranslations = function (selector) {
		selector = selector ? (selector + " ") : "";
		$(selector + ".i18n").each(function () {
			var defaultString = $(this).attr("data-lang");
			$(this).text(hg.t(defaultString));
		});
	};

	// Init internal objects
	hg.cons = {}; // constructors
	hg.network = {}; // network methods
	hg.util = {};

	// Loader object
	hg.load = {
		assignment: function (assignment) {
			hg.assignment = new hg.cons.Assignment(assignment);
			hg.refreshTranslations(hg.config.assignmentScopeSelector);
		},
		language: function (lang) {
			hg.lang = lang;
		}
	};

	// jQuery plugin
	$.fn.hackerGame = function (settings) {
		init.call(this);
	};
	$.fn.hackerGameTimer = function() {
		var jObj = this,
			ms = 1000, // number of ms to trigger
			callbackFn,
			display = function() {
				minutes = Math.floor(hg.timer.counter/60);
				seconds = hg.timer.counter - minutes*60;
				minutes = (minutes < 10 ? "0" : "") + minutes;
				seconds = (seconds < 10 ? "0" : "") + seconds;
				if (hg.timer.counter <= 60 && !$(jObj).is(".red-alert")) {
					$(jObj).addClass("red-alert");
				}
				$(jObj).text(minutes + ":" + seconds);
			},
			step = function () {
				var minutes, seconds;
				hg.timer.counter -= 1;
				display();
				if (isNaN(hg.timer.counter) || hg.timer.counter <= 0) { return; }
				hg.timer.status = setTimeout(step, ms);
			};
		hg.timer = {
			counter: 0,
			obj: jObj,
			status: undefined, 
			start: function (setCounter, callback) {
				if ($(jObj).is(".red-alert")) {
					$(jObj).removeClass("red-alert");
				}
				this.counter = setCounter;
				callbackFn = callback || function() {};
				display();
				hg.timer.status = setTimeout(step, ms);
			},
			stop: function () {
				counter = 0;
				if (this.status) { clearTimeout(this.status); }
				callbackFn();
			}
		};
		return this;
	};
})(jQuery, HackerGame);
