POSE.Share = new function () {
    var self = this;

    this.requiredScripts = [];
    this.queue = [];
    this.counter = 0;

    this.init = function() {
        POSE.Event.listen(POSE.EVENTS.SCROLL, self.testVisible);
        self.testVisible();
    };

    this.testVisible = function() {
        $('.shareButtons.notLoaded').each(function(){
            var el = $(this);
            if ( ! POSE.Util.isInViewport(el.find('h4').get(0))) {
                return;
            }
            self.load(el);
        });
    };

    this.load = function(container) {
        container.find('li').each(function(){
            var el = $(this), funcName = el.attr('class');
            if (typeof self[funcName] == 'function') {
                self[funcName](el, self.getURL(el), self.getTitle(el));
            }
        });
        container.removeClass('notLoaded');
    };

    this.getURL = function(el) {
        return POSE.Meta.get('landing_url');
    };

    this.getTitle = function(el) {
        return POSE.Meta.get('title').toString().trim();
    };

    this.facebook = function(el, url) {
        var params = {
            href: url,
            width: 44,
            height: 61,
            colorscheme: 'light',
            layout: 'box_count',
            action: 'like',
            show_faces: 'false',
            send: 'false'
        };

        el.html(POSE.Util.getIframe('//www.facebook.com/plugins/like.php?' + $.param(params), 44, 61));
    };

    this.twitter = function(el, url, title) {
        var params = {
            url: url,
            via: 'posevn',
            text: title,
            count: 'vertical'
        };

        el.html(POSE.Util.getIframe('//platform.twitter.com/widgets/tweet_button.html?' +
                $.param(params).replace(/\+/g, '%20'), 59, 62));
    };

    this.google = function(el, url) {
        el.html('<div class="g-plusone"' +
                     'data-size="tall"' +
                     'data-href="' + url + '"></div>');

        if (self.requiredScripts.indexOf('google') == -1) {
            POSE.Util.require('//apis.google.com/js/plusone.js');
            self.requiredScripts.push('google');
        } else {
            gapi.plusone.go();
        }
    };

    this.linkedin = function(el, url) {

        el.html('<script type="IN/Share" ' +
                        'data-url="' + url + '" ' +
                        'data-counter="top"></script>');

        if (self.requiredScripts.indexOf('linkedin') == -1) {
            POSE.Util.require('//platform.linkedin.com/in.js');
            self.requiredScripts.push('linkedin');
        } else {
            IN.init();
        }
    };

    this.pinterest = function(el, url, title) {
        var pinId = 'pinit-' + (++self.count),
            imgSrc = $(".pinnable:last").attr('src'),
            params = {
                url: url,
                description: title,
                media: imgSrc
            };

        if ( ! imgSrc) {
            imgSrc = '/images/Square_Default.jpg';
        }

        el.html('<a id="' + pinId + '" ' +
                   'href="//pinterest.com/pin/create/button/?"' + $.param(params) + ' ' +
                   'data-pin-do="buttonPin" ' +
                   'data-pin-config="above">' +
                '<img src="//assets.pinterest.com/images/pidgets/pin_it_button.png" />' +
            '</a>');

        if (self.requiredScripts.indexOf('pinterest') == -1) {
            POSE.Util.require('//assets.pinterest.com/js/pinit.js');
            self.requiredScripts.push('pinterest');
        } else {
            var pinElement = document.getElementById(pinId);
            (function (x) {
                for (var n in x) if (n.indexOf('PIN_') == 0) return x[n];
                return null;
            })(window).f.render.buttonPin(pinElement);
        }
    };
};
