POSE.History = new function() {
    var self = this,
        didPushedState = false,
        didPop = false;

    this.customPopState = null;

    this.init = function() {
        $(window).on('popstate', self.pop);
    };

    this.push = function(data, title, url) {
        didPushedState = true;

        // History API doesn't update the page title yet
        document.title = title;

        history.pushState(data, title, url);
    };

    this.didPop = function() {
        return didPop;
    };

    this.pop = function(event) {
        // Don't fire popstate on page load (some browser versions do this)
        if (didPushedState === false) {
            didPushedState = true;
            return;
        }

        var location = history.location || document.location;

        didPop = true;

        if (typeof self.customPopState == 'function') {
            self.customPopState(event.originalEvent.state, location, event);
            return;
        }

        if (POSE.ChannelLoad.isChannelPage()) {
            POSE.ChannelLoad.popState(event.originalEvent.state, location, event);
        } else {
            POSE.PageLoad.popState(event.originalEvent.state, location, event);
        }
        didPop = false;
    };
};
