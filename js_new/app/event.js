POSE.EVENTS = {
    SCROLL:          'PAGE_SCROLL',
    RESIZE:          'WINDOW_RESIZED',
    CLICK:           'click',
    MOUSEOVER:       'mouseover',
    PAGE_READY:      'PAGE_READY',  // fired when DOM is ready or AJAX load finished
    PAGE_LOADED:     'PAGE_LOADED', // fired when page finished loading
    ASIDE_OPENED:    'ASIDE_OPENED',
    ASIDE_CLOSED:    'ASIDE_CLOSED',
    META_LOADED:     'META_LOADED',
    KEY_DOWN:        'keydown',
    TOUCH_START:     'touchstart',
    TOUCH_END:       'touchend',
    JUMP_TO_PAGE:    'PAGELOAD_JUMPTOPAGE'
};

POSE.Event = new function () {
    var self = this;
    this.liveEvents = [];

    this.init = function() {
        $(window).scroll(POSE.Util.debounce(self.scrollWindow, 100, true));
        $(window).resize(POSE.Util.debounce(self.resizeWindow, 150, true));
        POSE.Footer.init();
    };

    this.fire = function(evtName, properties, target) {
        var evt = $.Event(evtName, properties);

        if (!target) {
            target = $("body");
        }

        target.trigger(evt);
    };

    this.listen = function (evtName, callback, target, source) {

        if (typeof target == 'undefined') {
            target = "body";
        }

        if (typeof source == 'undefined') {
            source = document;
        }

        $(source).delegate(target, evtName, callback);
        self.liveEvents.push({
            evtName: evtName,
            callback: callback,
            target: target
        });
    };

    this.remove = function (evtName, callback, target) {
        if (!target) {
            target = "body";
        }

        if (self.liveEvents.length) {
            for (var i = 0; i < self.liveEvents.length; i++) {
                if (target == self.liveEvents[i].target && evtName == self.liveEvents[i].evtName && callback == self.liveEvents[i].callback) {
                    $(document).undelegate(self.liveEvents[i].target, self.liveEvents[i].evtName, self.liveEvents[i].callback);
                    self.liveEvents.splice(i, 1);
                    break;
                }
            }
        }
        if (typeof self.liveEvents != 'object') {
            self.liveEvents = [];
        }
    };

    this.removeAll = function () {
        if (!self.liveEvents.length) {
            return;
        }
        for (var i = 0; i < self.liveEvents.length; i++) {
            $(document).undelegate(self.liveEvents[i].target, self.liveEvents[i].evtName, self.liveEvents[i].callback);
        }
        self.liveEvents = [];
    };
    
    this.scrollWindow = function() {
        $('.lazyload').lazyload();
        POSE.Event.fire(POSE.EVENTS.SCROLL);
    };

    this.resizeWindow = function () {
        self.setMode();

        POSE.Event.fire(POSE.EVENTS.RESIZE, {
            width: POSE.Obj.screen['width'],
            height: POSE.Obj.screen['height']
        });

        $('.lazyload').lazyload();
    };
    
    this.setMode = function() {
        POSE.Obj.screen['width'] = $(window).width();
        POSE.Obj.screen['height'] = $(window).height();

        var previousMode = POSE.Obj.screen['mode'],
            snapLevel = 3;

        // figure out which screen snap mode you're in
        if (POSE.Obj.screen['width'] < 768) {
            snapLevel = 0;
        } else if (POSE.Obj.screen['width'] < 1024) {
            snapLevel = 1;
        } else if (POSE.Obj.screen['width'] < 1280) {
            snapLevel = 2;
        }

        POSE.Obj.screen['mode'] = POSE.snapLevels[snapLevel];

        // Only if the mode actually changes do we need to do anything
        if (previousMode != POSE.Obj.screen['mode']) {
            var i = 0,
                $body = $('body');
            $body.attr('id', POSE.Obj.screen['mode']);
            $.each(POSE.snapLevels, function(key, value) {
                $body.removeClass(POSE.snapLevels[key].toLowerCase());
                if (i <= snapLevel) {
                    $body.addClass(POSE.snapLevels[key].toLowerCase());
                }
                i++;
            });
        }
    };
};
