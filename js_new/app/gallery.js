POSE.Gallery = function (options) {
    var self = this;
    var defaults = {
        slideshow: $(".slideshow:last"),
        pagination: $(".galleryPagination:last"),
        currentPage: $(".galleryPagination:last .imageNumber"),
        title: $(".theArticle:last .hSubTitle"),
        headerImage: $(".bigPicture:last .articleImg"),
        content: $(".theArticle:last .caption"),
        nextPage: $(".theArticle:last .pageLink"),
        slideshowControls: $(".slideshowControls:last"),
		    saveButton: $(".slideshowControls:last .saveButton"),
        //playButton: $(".slideshowControls:last .playButton"),
        //pauseButton: $(".slideshowControls:last .pauseButton"),
        prevArrow: $('.slideshow:last .fotorama__arr--prev'),
        nextArrow: $('.slideshow:last .fotorama__arr--next'),
        autoplay: 5000,
        startIndex: 0,
        loadGallery: true,
        updateMeta: true,
        startHidden: false,
        useSuggestions: false
    };

    var hoverFlag = false,
        api = null,
        autoplayStatus = false,
        beginCountdown = false,
        autoplayNext = false, // show next image when autoplay is enabled
        isRedirecting = false; // Prevent multiple pageloads

    this.options = $.extend({}, defaults, options);

    self.init = function () {
        self.validateEnvironment();
        self.options['slideshow'].fotorama();
        api = self.options['slideshow'].data('fotorama');

        if (!api) throw new Error("Fotorama API inaccessible");

        if (self.options['startHidden']) {
            self.hideGallery();
        } else if (!self.options['startHidden']) {
            self.options['headerImage'].hide();
        }

        if (self.options['startIndex'] > 0) {
            api.show({index: self.options['startIndex'], time: 0});
        }

        self.options['currentPage'].text(api.activeIndex + 1);

        (self.options['autoplay']) ? self.startAutoplay() : self.pauseAutoplay();

        self.bindEvents();
        self.updateNextButton();

        // When loading new page, kill all binds
        POSE.Event.listen(POSE.EVENTS.JUMP_TO_PAGE, self.unbindEvents);
        POSE.Event.fire('GALLERY_LOADED');
    };

    self.validateEnvironment = function () {
        // Check required structure
        if (self.options['slideshow'].length < 1) throw new Error("slideshow missing from view");
        if (self.options['pagination'].length < 1) throw new Error("pagination missing from view");
        if (self.options['currentPage'].length < 1) throw new Error("currentPage missing from view");
        if (self.options['slideshowControls'].length < 1)
            throw new Error("slideshowControls missing from html");
       // if (self.options['playButton'].length < 1) throw new Error("playButton missing from view");
        //if (self.options['pauseButton'].length < 1) throw new Error("pauseButton missing from view");
    };

    self.bindEvents = function () {
        //self.options['playButton'].click(self.startAutoplay);
        //self.options['pauseButton'].click(self.pauseAutoplay);
		//self.options['saveButton'].click(self.savePhoto);



        self.options['slideshow'].on('fotorama:show', function (e, fotorama) {
            self.setPage(fotorama.activeIndex, fotorama.activeFrame);
        });

        // Toggle the buttons if the slideshow is stopped without using controls
        self.options['slideshow'].on('fotorama:stopautoplay', self.pauseAutoplay);

        $(document).on('click', '.nextSlide', function() {
            api.show('>');
            POSE.Util.scrollTo(self.options['slideshow'], null, true);
            return false;
        });

        self.options['slideshow'].mouseenter(function() {
            hoverFlag = true;
            self.toggleControls();
        }).mouseleave(function(e) {
            hoverFlag = false;
            self.toggleControls(e);
        });


		self.options['slideshowControls'].click(function() {
		   var FileName =  api.activeFrame.img.split('/').pop();
		   self.SaveToDisk(api.activeFrame.img,FileName);
    });


        self.options['slideshowControls'].hover(function(e) {
           hoverFlag = true;
           self.toggleControls(e);
        });

        self.options['pagination'].hover(function(e) {
            hoverFlag = true;
            self.toggleControls(e);
        });

        $(".fotorama__stage").on('tap', function(e) {
            if ($('.fotorama__wrap--no-controls').length > 0) {
                hoverFlag = false;
            } else {
                hoverFlag = true;
            }
            self.toggleControls(e);
        });

        POSE.Event.listen('COUNTDOWN_STOP', self.pauseCountdown);
        POSE.Event.listen('COUNTDOWN_START', self.startCountdown);
        POSE.Event.listen('COUNTDOWN_FINISHED', self.goToNextPage);
    };

    this.unbindEvents = function () {
        //self.options['playButton'].off('click');
        //self.options['pauseButton'].off('click');
        self.options['slideshow'].off('fotorama:show fotorama:stopautoplay fotorama:showend');

        $(document).off('click', '.nextSlide');

        POSE.Event.remove(POSE.EVENTS.JUMP_TO_PAGE, self.unbindEvents);
        POSE.Event.remove('COUNTDOWN_STOP', self.pauseCountdown);
        POSE.Event.remove('COUNTDOWN_START', self.startCountdown);
        POSE.Event.remove('COUNTDOWN_FINISHED', self.goToNextPage);
        self.pauseAutoplay();
    };

    this.setPage = function () {
        if (self.isLastPage()) { self.pauseAutoplay(); }

        if (self.options['updateMeta'] && api.activeIndex+1 != api.size) {
            POSE.Meta.loadMetaCallback(api.activeFrame.filename, function () {
                //POSE.RespAds.reload();
            });
        }
        if ((self.options['useSuggestions'] && !self.isLastPage())
            || !self.options['useSuggestions'] ) {
            self.options['currentPage'].html(api.activeIndex+1);
        }

        self.updateBackground();

        if (self.options['useCountdown'] && self.isLastPage() && beginCountdown) {
            if (!$('.countdown__spinner').length) {
                POSE.Countdown.delay = 8;
                POSE.Countdown.init();
                $('.countdown__spinner').addClass('spinner');
                POSE.Event.listen(POSE.EVENTS.CLICK, POSE.Countdown.toggle, '.countdown');
            }
            $('.slideshowControls').addClass('hide');
            $('.countdown').addClass('show');
            POSE.Countdown.start();
        } else if (self.options['useCountdown'] && !self.isLastPage()) {
            $('.countdown').removeClass('show');
            $('.slideshowControls').removeClass('hide');
            POSE.Countdown.stop();
            POSE.Countdown.reset();
        }

        if (self.options['updateCaption']) {
            self.options['title'].html(api.activeFrame.pagetitle);
            self.options['content'].html(api.activeFrame.pagebody);
            self.updateNextButton();
        }
    };

    this.updateBackground = function() {
        if (!self.isLastPage()) {
            self.options['slideshow'].parent().css({
                'background-image': 'url(' + api.activeFrame.img + ')'
            });
        }
    };

    this.updateNextButton = function() {
        var $a = '';

        if (self.isLastPage()) {
            if (api.activeFrame.usesuggestions) {
                var nextFilename = api.activeFrame.filename;
            } else {
                var nextFilename = POSE.Aside.getNextArticleFilename();
            }
            if (nextFilename) {
                $a = $('<a />');
                $a.attr('href', '/' + nextFilename);
                $a.addClass('jumpToPage');
                $a.append("Next Article");
            }
        } else {
            $a = $('<a />');
            $a.attr('href', '/' + api.activeFrame.filename);
            $a.addClass('nextSlide');
            $a.append("Next Page");
        }

        self.options['nextPage'].html($a);
    };

    this.startAutoplay = function () {
        autoplayStatus = true;
        if (!self.isLastPage()) beginCountdown = true;
        if (autoplayNext) {
            api.show('>');
        } else {
            autoplayNext = true;
        }
        api.startAutoplay();
        //self.options['playButton'].hide();
       // self.options['pauseButton'].show();
    };

    this.pauseAutoplay = function () {
        autoplayStatus = false;
        if (!self.isLastPage()) beginCountdown = false;
        api.stopAutoplay();
        //self.options['playButton'].show();
        //self.options['pauseButton'].hide();
    };

    this.hideGallery = function () {
        self.pauseAutoplay();
        self.options['slideshow'].parent().addClass('off').removeClass('on');
        self.options['headerImage'].show();
    };

    this.showGallery = function () {
        self.options['slideshow'].parent().addClass('on').removeClass('off');
        self.options['headerImage'].hide();
        if (self.options['autoplay']) self.startAutoplay();
    };

    this.isLastPage = function() {
        return api.activeIndex + 1 === api.size;
    };

    this.toggleControls = function(e) {
//		$('.slideshowControls').toggleClass('noControls', !hoverFlag);
        $('.slideshowControls').toggleClass('noControls', !hoverFlag);
        $(self.options['pagination']).toggleClass('noControls', !hoverFlag);
    };

    this.pauseCountdown = function() {
        $('.countdown').addClass('stop');
    };

    this.startCountdown = function() {
        $('.countdown').removeClass('stop');
    };

    this.goToNextPage = function() {
        if (!isRedirecting) {
            isRedirecting = true;
            window.location.href = '/' + api.activeFrame.filename;
        }
    };



    this.SaveToDisk = function(fileURL,fileName) {
    		// for non-IE
    		if (!window.ActiveXObject) {
    			var save = document.createElement('a');
    			save.href = fileURL;
    			save.target = '_blank';
    			save.download = fileName || 'unknown';
          save.click();
          
    			var event = document.createEvent('Event');
    			event.initEvent('click', true, true);
    			save.dispatchEvent(event);
    			(window.URL || window.webkitURL).revokeObjectURL(save.href);

    		}

    		// for IE
    		else if ( !! window.ActiveXObject && document.execCommand)     {
    			var _window = window.open(fileURL, '_blank');
    			_window.document.close();
    			_window.document.execCommand('SaveAs', true, fileName || fileURL)
    			_window.close();
    		}
    };

    // Intitialize the gallery
    try {
        self.init();
    } catch (err) {
        return console.error(err);
    }
    return self;
};
