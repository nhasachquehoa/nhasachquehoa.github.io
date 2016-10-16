var DFP = new function () {
    var self = this;
    this.vars = {}; // will be merged with custom vars and overwrite any existing var

    this.getASTag = function () {
        return '';
        var rsi_segs = [];
        var segs_beg = document.cookie.indexOf('rsi_segs=');
        if (segs_beg >= 0) {
            segs_beg = document.cookie.indexOf('=', segs_beg) + 1;
            if (segs_beg > 0) {
                var segs_end = document.cookie.indexOf(';', segs_beg);
                if (segs_end == -1) segs_end = document.cookie.length;
                rsi_segs = document.cookie.substring(segs_beg, segs_end).split('|');
            }
        }
        var segLen = 20;
        var segQS = [];
        if (rsi_segs.length < segLen) {
            segLen = rsi_segs.length
        }
        for (var i = 0; i < segLen; i++) {
            segQS.push(rsi_segs[i]);
        }
        return segQS.join();
    };

    this.createSlot = function(sizes, targeting, divId, unitName) {
        var slot;

        if(sizes[0] == 'out-of-page') {
            slot = googletag.defineOutOfPageSlot(unitName, divId);
        } else {
            slot = googletag.defineSlot(unitName, sizes, divId);
        }

        slot.addService(googletag.pubads());
        for (var key in targeting) {
            if (targeting.hasOwnProperty(key)) {
                slot.setTargeting(key, targeting[key]);
            }
        }
    };

    this.setCustomValues = function () {
        var vars = {
            channel:    AM.Meta.get('channel').toLowerCase().replace( /[^a-z0-9]/g, ''),
            subchannel: AM.Meta.get('subchannel').toLowerCase().replace( /[^a-z0-9]/g, ''),
            pagetype:   AM.Meta.get('isIndex') == 1 ? "am_channel" : "am_article"
        },
            articleId    = AM.Meta.get('aid'),
            channelId    = AM.Meta.get('idChannel'),
            subchannelId = AM.Meta.get('idSubChannel'),
            special      = AM.Util.getParam('special');

        if (document.referrer != '') {
            if (document.referrer.indexOf('pose.com.vn') != -1) {
                vars['r'] = 'pose.com.vn';
            } else {
                vars['r'] = encodeURIComponent(document.referrer);
            }
        }

        /* @TODO Make custom targeting work
        if (subchannelId in AM.RespAds.adTags) {
            vars['pagetype'] = AM.RespAds.adTags[subchannelId];
        } else if (channelId in AM.RespAds.adTags) {
            vars['pagetype'] = AM.RespAds.adTags[channelId];
        }
        */

        if (articleId) {
            vars['article_id'] = articleId;
        }

        vars['rsi_segs'] = self.getASTag();

        if (vars['subchannel'] == '') {
            delete vars['subchannel'];
        }

        // Overwrite variables with the ones defined on the object if set
        $.extend(vars, self.vars);

        // Special should be set after so that it can be overwritten via query string
        if (special) {
            vars['special'] = special;
        }

        for (key in vars) {
            googletag.pubads().setTargeting(key, vars[key]);
        }

        return vars;
    };

    this.show = function(sizes, targeting, divId, unitName) {

        if (typeof googletag == 'undefined') {
            googletag = { cmd: [] };
        }

        googletag.cmd.push(function() {
            var vars = self.setCustomValues();
            self.createSlot(sizes, targeting, divId, unitName);

            if (AM.subDomain == 'uk') {
                if (typeof NUGGarr != 'undefined') {
                    for (var key in NUGGarr) {
                        googletag.pubads().setTargeting(key, NUGGarr[key]);
                    }
                }
            }

            if (AM.Meta.get('type_of') != 'Gallery') {
                googletag.pubads().collapseEmptyDivs();
            }

            googletag.pubads().enableAsyncRendering();
            googletag.enableServices();
            googletag.display(divId);

            // DFP template clears this timer if arrived before timeout to hold onto the channel animation.
            if(sizes[0] == 'out-of-page' && $('body').hasClass('rootChannel')) {
                stitialReturnTimer = setInterval(function() {AM.RespAds.dfp.closeInterstitial();}, 2000);
            }
        });
    };
};
