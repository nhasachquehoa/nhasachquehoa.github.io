POSE.Plus = new function() {
    var self = this;
    this.animationDelay = 75;

    this.init = function() {
        POSE.Event.listen('click',         POSE.Plus.shareClick, '.plus .shareBtn'); // Click a button in plus
        POSE.Event.listen(POSE.EVENTS.CLICK, POSE.Plus.toggle,     '.plus .toggleBtn'); // Click the plus button
    };

    this.toggle = function(e) {
          
        var $btn = $(e.currentTarget),
            $parent = self.getParent($btn);

        if ($(this).hasClass('open'))
        {
        
            if (e.type != 'click' && e.type != 'tap') {
                return;
            }
            self.animateOut($parent);
        }
        else
        {
            self.closeAll();
            self.animateIn($parent);
        }
        e.stopPropagation();
        e.preventDefault();
    };

    this.closeAll = function() {
        $('.plus').each(function(i, elem) {
            self.animateOut(self.getParent(elem));
        });
    };

    this.getParent = function(node) {
        node = $(node);
        var parent = node.closest(".articleTile");

        if (parent.length == 0) {
            parent = node.closest('.plus').parent();
        }

        return parent;
    };

    this.shareClick = function(e) {
        var $btn = $(e.currentTarget),
            $parent = self.getParent($btn);

        if ($btn.hasClass('bookmark')) {
            self.bookmark($parent);
        } else if ($btn.hasClass('mail')) {
            self.mail($parent);
        } else if ($btn.hasClass('google')) {
            self.google($parent);
        } else if ($btn.hasClass('twitter')) {
            self.twitter($parent);
        } else if ($btn.hasClass('facebook')) {
            self.facebook($parent);
        }

        self.animateOut($parent);
        e.stopPropagation();
    };

    this.animateIn = function($parent) {
        if ($parent.filter('[data-plus-bookmark="false"]').length == 1) {
            $parent.addClass('noBookmark');
        }
        $parent.addClass('open');
        $parent.find('.plus .toggleBtn').addClass('open');
        $parent.find('.plus .shareBtn').each(function(i, btn){
            window.setTimeout(function()
            {
                $(btn).addClass('open');
            }, self.animationDelay * i);
        });
    };

    this.animateOut = function($parent) {
        if ( ! $parent.hasClass('open')) {
            return;
        }
        $parent.removeClass('open');
        $parent.find('.plus .toggleBtn').removeClass('open');
        $parent.find('.plus .shareBtn').each(function(i, btn){
            window.setTimeout(function()
            {
                $(btn).removeClass('open');
            }, self.animationDelay * i);
        });
    };

    this.getArticleId = function(elem) {
        if (elem.filter('[data-aid]').length == 1) {
            return elem.attr("data-aid");
        }
        else {
            return POSE.Meta.get('aid');
        }
    };

    this.getFilename = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            return elem.attr("data-filename");
        }
        else {
            var url = POSE.Meta.get('landing_url');
            return url ? url.replace('http://events.pose.com.vn/', '') : '';
        }
    };

    this.getURL = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            var filename = elem.attr("data-filename");
            if (filename.indexOf('://') === -1) {
                return "http://events.pose.com.vn/" + filename;
            }
            return filename;
        }
        else if (elem.filter('[data-plus-url]').length == 1) {
            return elem.attr("data-plus-url");
        }
        else {
            return POSE.Meta.get('landing_url');
        }
    };

    this.getTitle = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            return elem.find(".title").text().toString().trim();
        }
        else if (elem.filter('[data-plus-text]').length == 1) {
            return elem.attr("data-plus-text");
        }
        else {
            return POSE.Meta.get('title').toString().trim();
        }
    };

    this.getBlurb = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            return elem.find(".blurb").text();
        } else {
            return POSE.Meta.get('description');
        }
    };

    this.getImage = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            var imgSrc = elem.find("img").attr('src');
            return imgSrc ? imgSrc.replace('180x180', '360x360') : '';
        } else {
            return $('meta[property="og:image"]').attr('content');
        }
    };

    this.getSmallImage = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            return elem.find("img").attr('data-small-src');
        } else {
            return $('meta[property="og:image"]').attr('content');
        }
    };

    this.getChannelName = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            return elem.find(".channel a").text();
        } else {
            return POSE.Meta.get('subchannel');
        }
    };

    this.getChannelFilename = function(elem) {
        if (elem.filter('[data-filename]').length == 1) {
            return elem.find(".channel a").attr('href').substr(1);
        } else {
            return POSE.Meta.get('description');
        }
    };

    this.bookmark = function(elem) {
        POSE.MyMagazine.add(self.getArticleId(elem), {
            filename:        self.getFilename(elem),
            title:           self.getTitle(elem),
            blurb:           self.getBlurb(elem),
            image:           self.getImage(elem),
            smallImage:      self.getSmallImage(elem),
            channelName:     self.getChannelName(elem),
            channelFilename: self.getChannelFilename(elem)
        });
    };

    this.mail = function(elem) {
        var url = self.getURL(elem),
            subject = self.getTitle(elem),
            body = "\n\n" + url;

        document.location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    };

    this.google = function(elem) {
        var url = self.getURL(elem);
        POSE.Util.popup("https://plus.google.com/share?url=" + encodeURIComponent(url));
    };

    this.twitter = function(elem) {
        var params = {},
            title = self.getTitle(elem),
            hashtags = elem.attr('data-plus-hashtags'),
            via = elem.attr('data-plus-via'),
            text = title,
            shortUrlLength = 22, // As reported by https://api.twitter.com/1/help/configuration.json
            maxLength = 140 - 3 - shortUrlLength - 2; // [RT ]Title[...] http://t.co/8888888888 via @posevn

        params['url'] = self.getURL(elem);
        params['text'] = text;

        if (typeof via !== "undefined") {
            if (via === "false") {
                maxLength -= 12;
            } else {
                params['via'] = via;
            }
        } else {
            if (POSE.subDomain == 'uk') {
                params['via'] = 'POSEVN';
            } else {
                params['via'] = 'POSEVN';
            }
        }

        // 140 - 3 ("RT ") - shortUrlLength - 2 (safety) - 12 (" via @posevn")
        if (title.length > maxLength) {
            text = title.substr(0, maxLength - 4) + "... ";
        }

        if (typeof hashtags !== "undefined") {
            params['hashtags'] = hashtags;
        }

        POSE.Util.popup("https://twitter.com/intent/tweet?" +
            $.param(params)
        );
    };

    this.facebook = function(elem) {
        var url = encodeURIComponent(self.getURL(elem));

        POSE.Util.popup("https://www.facebook.com/sharer.php?u=" + url);
    };


};
