(function($) {
    $.fn.lazyload = function(threshold) {

        var $w = $(window),
            th = threshold || 500,
            retina = window.devicePixelRatio > 1,
            attrib = "",
            images = this,
            loaded,
            inview,
            source;

        this.one("lazyload", function () {
            var self = $(this), thisAttrib = "data-small-src";

            if ( ! self.is(':visible')) {
                return;
            }

            self.removeClass('lazyload').removeAttr('width').removeAttr('height');

            if (self.closest('.articleTile').hasClass('bigBlock')) {
                thisAttrib = "data-src";
            } else {
               thisAttrib = "data-small-src"; 
            }
            source = this.getAttribute(thisAttrib);
            if (source) {
                self.hide();
                this.setAttribute("src", source);
                self.fadeIn('fast');
            }
        });

        function lazyload() {
            inview = images.filter(function () {
                var $e = $(this),
                    wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();

                return eb >= wt - th && et <= wb + th;
            });

            loaded = inview.trigger("lazyload");
            images = images.not(loaded);
        }
        lazyload();
        return this;
    };

})(jQuery);
