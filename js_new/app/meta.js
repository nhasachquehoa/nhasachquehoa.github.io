POSE.Meta = new function() {

	var self = this;
	
	this.get = function(key, attr) {
		if (typeof attr == "undefined") {
			attr = "content";
		}
		return $('head meta[name="' + key + '"]').attr(attr);
	};

    this.setMeta = function(data) {
        $('head').append(data);
        var url =  self.get('url');

        if (url == '/' || url == '') {
            url = self.get('landing_url');
        }
        POSE.History.push(null, self.get('title'), url);
        POSE.Event.fire(POSE.EVENTS.META_LOADED);
    };

    this.updateProp = function(name, content) {
        self.update(name, content, 'property');
    };

    this.update = function(name, content, type) {
        if ( ! type) {
            type = 'name';
        }
        var $meta = $('head meta[' + type + '="' + name + '"]');

        if ($meta.length == 0) {
            $('head').append('<meta ' + type + '="' + name + '" content="' + content + '" />');
        } else {
            $meta.attr('content', content);
        }
    };

    this.loadMetaCallback = function(filename, callback) {
        
        if (typeof filename == "undefined") {
	        filename = POSE.PageLoad.hasNextPage();
        }
		var idChannel =  self.get('idChannel');
		var type =  self.get('type_of');
		var encodedFilename = filename.replace(/\//g, '|');
        self.removeMeta();

        var url = '/Ajax/LoadMeta?type='+ type +'&idChannel='+ idChannel +'&key=' + encodedFilename;
        POSE.Element.get(url, function(data) {
            self.setMeta(data);
            if (callback) callback.call();
        });
    };

    this.loadMeta = function(filename, async) {
		var idChannel =  self.get('idChannel');
		var type =  self.get('type_of');
        if(typeof filename == "undefined") {
            filename = POSE.PageLoad.hasNextPage();
        }
        var encodedFilename = filename.replace(/\//g, '|');
        self.removeMeta();
        POSE.Element.get('/Ajax/LoadMeta?type='+ type +'idChannel='+ idChannel +'&key=' + encodedFilename , self.setMeta, async);
    };
    
    this.removeMeta = function() {
        $('head meta[name]').remove();
        $('head meta[property]').remove();
        $('head link[rel="next"]').remove();
        $('head link[rel="prev"]').remove();
    };
    
    this.loadChannelMeta = function(filename, callback) {
		var idChannel =  self.get('idChannel');
		var pages =  self.get('pages');
		var type =  self.get('type_of');
		var key =  self.get('key');
        self.removeMeta();
        POSE.Element.get('/Ajax/LoadMeta?type='+ type  +'&idChannel='+ idChannel +'&key='+ key + '&pages=' + pages, function(data) {
                self.setMeta(data);
                if (typeof callback == 'function') {
                    callback();
                }
        });
    };

	this.getLink = function(key, attr) {
		if (typeof attr == "undefined") {
			attr = "href";
		}
		return $('head link[rel="' + key + '"]').attr(attr);
	};
};
