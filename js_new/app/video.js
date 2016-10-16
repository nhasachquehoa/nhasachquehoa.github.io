POSE.Video = new function () {
    var self = this;

    this.count = 0;
    this.playBtnSelector = '.playerContainer .playBtn';
    this.forceHtml5 = false;
    this.forceIframe = false;

    this.init = function() {
        
        POSE.Event.listen(POSE.EVENTS.CLICK, POSE.Video.embedIFrame, self.playBtnSelector);

        var div = $(self.playBtnSelector);
        if (div.attr('data-autoplay') == 1 || Modernizr.touch) {
            div.trigger(POSE.EVENTS.CLICK);
        }
    };

    this.embedIFrame = function(e) {
        var target = $(e.target).closest('.playBtn'),
            slug = target.attr('data-video'),
            params = {
                url: 'http://events.pose.com.vn/video/' + slug,
                autoplay: true,
                force_html5: (self.forceHtml5) ? true : false
            },
            width  = '100%',
            height = '100%',
            iFrame = '<iframe src="http://widgets.ign.com/video/embed/content.html?' +
                $.param(params) + '" width="' + width + '" height="' + height +
                '" scrolling="no" frameborder="0" allowfullscreen></iframe>';

        target.closest('.playerContainer').addClass('embedded')
              .append(iFrame);
    };

};
