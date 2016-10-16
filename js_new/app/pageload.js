POSE.PageLoad = new function () {

    var self = this,
        scrollY = 0;
    this.scrollerContainerSelector = 'article';

    /**
     * Init func
     */
    this.init = function () {
        POSE.Event.listen(POSE.EVENTS.CLICK,       self.loadPage, '.jumpToPage');
        POSE.Event.listen(POSE.EVENTS.RESIZE,      self.fixOversizedMedia);
        POSE.Event.listen(POSE.EVENTS.SCROLL,      self.stickyTitle);
        POSE.Event.listen(POSE.EVENTS.PAGE_LOADED, self.stickyTitle);
        POSE.Event.listen(POSE.EVENTS.CLICK,       self.backTopTop, '#stickyTitleInner');

        //self.applyJumpToPage();
        self.applyLargeImage();
        self.insertNextArticleButton();
    };

    /**
     * API call to fetch an article
     */
    this.fetchArticle = function (filename) {

        var query = POSE.Element.buildQuery('?filename=' + filename.replace(/\//g, "|"));

        POSE.Progress.start();

        $.ajax({
            url: query,
            method: 'get',
            dataType: 'html',
            success: function(data) {
                self.setPage(data, filename);
            },
            processData: false,
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                try {
                    xhr.addEventListener("progress", function() {
                        POSE.Progress.increment(30);
                    }, false);
                } catch(e) {}
                return xhr;
            },
            complete: function() {
                POSE.Progress.done();
            }
        });
    };

    this.popState = function(event, location) {
        return;
        // Wait a tiny bit so that we can get the new scroll height
        setTimeout(function() {
            scrollY = $(window).scrollTop();
        }, 50);
        self.fetchArticle(location.pathname.slice(1));
    };

    /**
     * Once a page is fetched, it places it on the page. This is a callback function.
     */
    this.setPage = function(data, filename) {
        // Remove the meta from the returned HTML so that we can insert it into the <head> tag
        var startMarker = '<!-- [META START]',
            endMarker = '[META END] -->',
            startPos = data.indexOf(startMarker),
            endPos  = data.indexOf(endMarker),
            meta = data.substring(startPos + startMarker.length, endPos),
            html = data.substring(endPos + endMarker.length);

        // Not what we expected, redirect to the page we tried to load
        if (startPos == -1) {
            window.location.href = '/' + filename;
            return;
        }

        POSE.Meta.removeMeta();
        POSE.Meta.setMeta(meta);

        $(self.scrollerContainerSelector).html(html);

        $('body').animate({
            scrollTop: scrollY
        }, 500);

        scrollY = 0;

        POSE.Event.fire(POSE.EVENTS.PAGE_READY);
        self.fixOversizedMedia();
        self.applyJumpToPage();
        self.insertNextArticleButton();
    };

    /*
     * Checks to see if the current article has a next page, returns it if it has, or returns false
     * Return false if this is a gallery (LOAD MORE FORCE FROM RIGHT RAIL)
     */
    this.hasNextPage = function () {
        if (POSE.Meta.get('type_of') == 'Gallery') {
            return false;
        }

        var filename = POSE.Meta.getLink('next');

        if (typeof filename != "undefined" && filename != "") {
            return POSE.Util.getPath(filename);
        } else {
            return false;
        }
    };

    /*
     * Jumps directly to a page
     */
    this.jumpToPage = function (filename) {
        POSE.Event.fire(POSE.EVENTS.JUMP_TO_PAGE);

        self.fetchArticle(filename);
    };

    this.loadPage = function (e) {
        var target = $(this),
            filename = target.attr("href");

        // Read from data-href if we are on touch since we remove the href
        // in applyJumpToPage()
        if ( ! filename) {
            filename = target.attr('data-href');
        }

        self.jumpToPage(filename.slice(1));

        e.preventDefault();
    };

    /**
     * Find all internal links in article and make them snappy
     * @TODO this assumes so many things, should look to DB to see if empty. currently results html error
     */
    this.applyJumpToPage = function () {
        var pattern = /^(?:http:\/\/.{2,3}\.events.pose\.com.vn)?(.*?\.html)$/i;

        $("article a").each(function() {
            // need to remove domain name for page snapping to work
            var target = $(this),
                href = target.attr('href');

            if (typeof href == "undefined") {
                return;
            }

            var matches = href.match(pattern);
            if (matches) {
                target.attr('href', matches[1])
                      .addClass('jumpToPage');

                // Remove href on touch so that the URL bar does not show up
                if (Modernizr.touch) {
                    target.attr('href', '')
                          .attr('data-href', matches[1]);
                }
            }
        });
    };


    this.fixOversizedMedia = function () {
        self.fixBigObjects();
        self.fixBigIframes();
    };

    /**
     * Fix oversized images in an article
     */
    this.fixBigObjects = function () {
        $('.theArticle embed, .theArticle object').each(function () {
            var el = $(this);
            if (el.width() > el.closest('.theArticle').width()) {
                el.css('width', '100%');
                if (el.attr('width')) {
                    el.attr('width', '100%');
                }
                if (el.attr('height')) {
                    el.attr('height', 'auto')
                }
            }
        });
    };


    this.fixBigIframes = function () {
        var articleDiv = $('.theArticle');
        articleDiv.find('iframe').each(function () {
            var el = $(this);

            if (el.hasClass('resized') || el.closest('.shareButtons').length == 1) {
                return;
            }

            // Figure out size multiplier
            var newWidth = el.closest('.theArticle').width();
            var origWidth = el.attr('width');
            var origHeight = el.attr('height') || origWidth * 9 / 16;
            var multiplier = newWidth / origWidth;

            // Fix the iframe sizes
            el.attr('width', Math.round(newWidth));
            el.attr('height', Math.round(origHeight * multiplier));

            if (typeof el.attr('data-src') != "undefined") {
                el.attr('src', el.attr('data-src'));
                el.removeAttr('data-src');
                el.addClass('resized');
            }
        });
    };


    /**
     * set Large Image when not Tiny or Small
     */

    this.applyLargeImage = function () {
        var mainImage = $('.articleImg:last');
        var mainImageSrc = mainImage.attr('src');
        var mainImageLarge = mainImage.attr('data-src-large');

        if (mainImageLarge) {
            switch (POSE.Obj.screen['mode']) {
                case 'NORMAL':
                case 'LARGE':
                    mainImage.attr('src', mainImageLarge);
            }
        }
    };

    this.stickyTitle = function() {
        var h1 = $('h1:first');
        if (h1.length == 0) {
            return;
        }
        if (POSE.Util.isInViewport(h1.get(0))
            || $(window).scrollTop() < h1.offset().top) {
            $('#stickyTitleContainer').removeClass('sticky');
        } else {
            $('#stickyTitleContainer').addClass('sticky');
        }
    };

    this.backTopTop = function(event) {
        if ($(event.target).closest('#stickyTitleInner .plus').length == 0) {
            POSE.Util.scrollTo(0);
        }
    };

    this.insertNextArticleButton = function() {
        var nextFilename = POSE.Aside.getNextArticleFilename();
        if (nextFilename
            && ! self.hasNextPage()
            && $('.theArticle .pageLink').length == 0) {
            $('.theArticle').append(
                '<div class="pageLink">' +
                    '<a href="/' + POSE.Aside.getNextArticleFilename() +
                        '" class="jumpToPage">Next Article</a>' +
                '</div>'
            );
        }
    };
};
