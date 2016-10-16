POSE.ChannelLoad = new function () {
    var self = this,
        PAGE_TYPES = ['Channel', 'Archive', 'Homepage','Cat', 'Subcat'],
        $scrollContainer = null,
        animationCompleted = false;
    this.container = null;
    this.init = function() {
        $scrollContainer = $('#channelTiles');
        self.addLoadMore();

        // @TODO Create a more elegant way to make my magazine blocks show
        if ((POSE.Obj.pageType == 'Channel' || POSE.Obj.pageType == 'Cat') && POSE.Meta.get('cRoot') != 'my-magazine') {
            self.initWelcomeMat();
        }
        POSE.Event.listen(POSE.EVENTS.RESIZE, self.setTileSize);
    };

    this.addLoadMore = function() {
        if ( ! self.isChannelPage() || ! self.hasNextPage()) {
            return;
        }
        var html = '<div class="loader' +
                '" data-scroll-type="' + POSE.Obj.scrollType +
                '" data-track-category="' + POSE.Obj.pageType +
                '" data-track-label="Next Article' +
                '" data-track-action="Load More">' +
                    'XEM THĂM' +
                '</div>',
            $html = $(html);

        $html.on('click', function() {
            $html.text('ÄANG Táº¢I THĂM ...');
            self.fetchTiles();
        });
        $scrollContainer.append($html);
		
    };

    this.isChannelPage = function() {
        return PAGE_TYPES.indexOf(POSE.Obj.pageType) >= 0;
    };

    this.fetchTiles = function() {
		var idChannel =  POSE.Meta.get('idChannel');
		var pages =  POSE.Meta.get('pages');
		var key =  POSE.Meta.get('key');
		if(key == 'undefined'){ key ='';  }
		
        POSE.Element.get('/Ajax/LoadPost?type='+ POSE.Obj.pageType +'&idChannel='+ idChannel +'&key='+ key + '&pages='+ pages, self.setPage);
    };

    this.popState = function(event, location) {
        // stub
    };

    this.setPage = function(data) {
		if(data){
			$scrollContainer.append(data);
			self.setTileSize();
			POSE.Meta.loadChannelMeta(self.getNextPage(), function() {
				$('.loader').remove();
				self.addLoadMore();
				POSE.Event.fire(POSE.EVENTS.PAGE_READY);
				self.autoScroll();
			});
		}else{
			alert('KhĂ´ng cĂ³ dá»¯ liá»‡u hiá»‡n thá»‹ má»›i');
			}
		
    };

    this.autoScroll = function() {
		var pages =  parseInt(POSE.Meta.get('pages'));
		pages = pages.toString();
        var $scrollAnchor = $('.page' + pages),
            scrollTop = $scrollAnchor.position().top;
            offset = parseFloat($('#channelTiles').css('top'));
			
		if (self.hasNextPage()) {
            scrollTop = (offset > 0 ? offset + scrollTop + 1: scrollTop - POSE.headerHeight );
            POSE.Util.scrollTo(scrollTop);
        } else {
            POSE.Util.scrollTo($('#channelTiles').height());
        }

			
			
			
    };
    
    /*
     * Checks to see if the current channel has a next page
     */
    this.hasNextPage = function() {
        var relNext = POSE.Meta.getLink('next');
        return typeof relNext != 'undefined' && relNext != "";
    };

    this.getNextPage = function() {
        if ( ! self.hasNextPage()) {
            return false;
        }
        return POSE.Util.getPath(POSE.Meta.getLink('next'));
    };

    this.initWelcomeMat = function() {
        if (animationCompleted) {
            return;
        }

        var pageHeight = $(window).height() - 46,
            titleHeight = 260,
            carouselHeight = POSE.Obj.screen['mode'] == 'TINY' ? 0 : 150,
            minHeight = titleHeight + carouselHeight;

        if (pageHeight < minHeight) {
            pageHeight = minHeight;
        }

        self.tileOffest = carouselHeight + titleHeight;

        $('#welcomeMatOuter').height(pageHeight);
        $('#channelTiles, #footer').hide();
    };

    this.animate = function() {
        if (POSE.Obj.pageType != 'Channel' && POSE.Obj.pageType != 'Cat') {
            return;
        }

        $('#channelTiles, #footer').show();
        $('.lazyload').lazyload();

        $('#welcomeMatOuter').addClass('animate').animate(
            { height: self.tileOffest }, 1000, 'swing', function(){
                $('.lazyload').lazyload();
            }
        );

        $('#welcomeMatAd').slideDown(500);
        animationCompleted = true;
    };
    
    this.setTileSize = function() {
        $('.tiny .articleTile').removeClass('bigBlock');
        $('.small .articleTile').addClass('bigBlock');
        var photo = $('.featuredArticle .photo img');
        if ($('.small .featuredArticle .photo').length) {
            var srcToUse = photo.attr('data-src-wide') || photo.attr('data-src-flash');
            photo.attr('src', srcToUse).removeClass('square').addClass('wide');
			
			var srcBannerToUse = $('#topbanner').attr('data-src-wide') ;
			$('#topbanner').attr('src', srcBannerToUse).removeClass('square').addClass('wide');
			var srcBannerDetailPageToUse = $('#BannerDetailPage').attr('data-src-wide') ;
			
        } else {
            photo.attr('src', photo.attr('data-src-square'))
                .addClass('square')
                .removeClass('wide');
			var srcBannerToUse = $('#topbanner').attr('data-src-square') ;
			$('#topbanner').attr('src', srcBannerToUse).removeClass('square').addClass('wide');
			
        }
		
		// Banner in detail page

		if ($('.small #AdDetailPage').length) {
			var srcBannerDetailPageToUse = $('#BannerDetailPage').attr('data-src-wide') ;
			$('#BannerDetailPage').attr('src', srcBannerDetailPageToUse).removeClass('square').addClass('wide');
        } else {
			var srcBannerDetailPageToUse = $('#BannerDetailPage').attr('data-src-square') ;
			$('#BannerDetailPage').attr('src', srcBannerDetailPageToUse).removeClass('square').addClass('wide');
        }


		
		
		
    }
};
