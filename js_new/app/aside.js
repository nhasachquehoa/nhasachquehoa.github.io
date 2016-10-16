POSE.Aside = new function () {
    var self = this,
        nextArticleFilename = null,
        sly = [];
    this.status     = null; // DISABLED, OPENED, CLOSED
    this.selector   = 'aside';
    this.isFloating = false;
    this.init = function() {
        if (self.status == false) {
            return;
        }
        self.reload();
        POSE.Event.listen(POSE.EVENTS.RESIZE, self.resized);
        POSE.Event.listen(POSE.EVENTS.PAGE_READY , self.reload);
    };
    // Executed on every article load
    this.reload = function() {
        nextArticleFilename = null;
        self.removeThisArticle();
		$bottom = $('#bottomTiles');
        var max = self.calcMaxTiles() + 1,
            $bottom = $('#bottomTiles'),
            data = [
                $('.row1').find('.relatedArticle').detach(),
                $('.row2').find('.hotArticle').detach(),
                $('.row3').find('.newArticle').detach()
            ],
            headings = ['BĂ i viáº¿t liĂªn quan', 'BĂ i viáº¿t Ä‘á»c nhiá»u', 'BĂ i viáº¿t má»›i'];
        for(var i = 0; i < 3; ++i) {
            var $row = $('#bottomTiles').find('.row' + (i + 1));
            // Check if particular row has any articles
            // End current loop iteration and remove row if no articles are found
            var numberOfArticles = data[i].length;
            if(numberOfArticles == 0) {
                $row.remove();
                continue;    
            }
            $row.find('.items').append(data[i]);
            $row.find('[data-track-action]').each(function(index, elem){
                var $elem = $(elem);
                if ($elem.closest('.plus').length == 0) {
                    $(elem).attr('data-track-action', headings[i]);
                }
            });
			/*
            sly[i] = new Sly($row.find('.frame'), {
                horizontal: 1,    // Switch to horizontal mode
                itemNav: 'basic', // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'
                smart: 1,         // Repositions the activated item to help with further navigation
                mouseDragging: 1, // Enable navigation by dragging the SLIDEE with mouse cursor
                touchDragging: 1, // Enable navigation by dragging the SLIDEE with touch events
                releaseSwing: 1,  // Ease out on dragging swing release
                scrollBy: 0,      // Pixels or items to move per one mouse scroll. 0 to disable scrolling
                pagesBar: $row.find('.pages'), // Selector or DOM element for pages bar container
                nextPage: $row.find('.next'),
                prevPage: $row.find('.prev'),
                activatePageOn: 'click', // Event used to activate page. Can be: click, mouseenter, ...
                pageBuilder: // Page item generator
                    function () {
                        return '<li></li>';
                    },
                speed: 300,           // Animations speed in milliseconds. 0 to disable animations
                elasticBounds: 1,     // Stretch SLIDEE position limits when dragging past FRAME boundaries
                easing: 'easeOutExpo' // Easing for duration based (tweening) animations
            }).init();
			*/
        }
        $(self.selector).children().slice(max).remove();
        self.loadImages();
    };
    this.removeThisArticle = function() {
        $('.articleTile[data-aid=' + POSE.Meta.get('aid') + ']').remove();
    };
    this.calcMaxTiles = function() {
        var articleHeight = $('.articleMain').height(),
            medrecHeight  = 252,
            tileHeight    = $(self.selector).width() / 2,
            tileCount     = Math.floor((articleHeight - medrecHeight) / tileHeight);
        return Math.max(0, tileCount);
    };
    this.loadImages = function() {
        $(self.selector + ' .lazyload').lazyload();
    };
    this.getNextArticleFilename = function() {
        nextArticleFilename = nextArticleFilename || $(self.selector + ' .articleTile[data-filename]').attr('data-filename');
        return nextArticleFilename;
    };
    this.open = function () {
        self.status = "OPENED";
        $(self.selector).show();
        self.loadImages();
    };
    this.close = function () {
        self.status = "CLOSED";
        $(self.selector).hide();
    };

    // Page resized
    this.resized = function() {
        $.each(sly, function(index, elem) {
            if (elem) {
                elem.reload();
            }
        });

        if (POSE.Aside.status == 'DISABLED') {
            return;
        }

        switch(POSE.Obj.screen['mode']) {
            case 'TINY':
            case 'SMALL':
                $('body').addClass('asideFloat')
                         .removeClass('asideInline');
                self.close();
                break;
            case 'NORMAL':
            case 'LARGE':
                $('body').removeClass('asideFloat')
                         .addClass('asideInline');
                self.open();
        }
    };
};
