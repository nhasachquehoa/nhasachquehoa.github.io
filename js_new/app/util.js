POSE.Util = {
    metaTags: [],
    cookies: null
};

POSE.Util.isInViewport = function(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */
        );
};

/*
 * Scrolls document or <element> (selector or jQuery object) to
 * <target> (integer, selector or jQuery object) and accounts for
 * the sticky header if true
 ***/
POSE.Util.scrollTo = function (target, element, accountForHeader) {
    if (typeof target !== 'number') {
        if ( ! (target instanceof jQuery)) {
            target = $(target);
        }

        var offset = target.offset();

        if (offset.top) {
            target = Math.max(0, offset.top - (accountForHeader ? POSE.headerHeight : 0));
        } else {
            target = 0;
        }
    }

    if ( ! element) {
        element = $("html, body");
    }

    if ( ! (element instanceof jQuery)) {
        element = $(element);
    }

    element.stop().animate({
        scrollTop: target
    }, 1000, 'easeInOutCirc');
};

POSE.Util.getPath = function (url) {
    var a = document.createElement('a');
    a.href = url;
    return (a.pathname.charAt(0) == '/') ? a.pathname.slice(1) : a.pathname;
};

POSE.Util.getParam = function (name) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == name) {
            return decodeURIComponent(pair[1]);
        }
    }
    return false;
};

POSE.Util.parseURL = function (str, mode) {
    var options = {
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    }, m, uri = {}, i = 14;
    mode = mode || 'loose';
    m = options.parser[mode].exec(str);
    while (i--) {
        uri[options.key[i]] = m[i] || "";
    }
    uri[options.q.name] = {};
    uri[options.key[12]].replace(options.q.parser, function ($0, $1, $2) {
        if ($1) {
            uri[options.q.name][$1] = $2;
        }
    });
    return uri;
};

POSE.Util.require = function(src, callback) {
    var tag = document.createElement('script');
    tag.type = 'text/javascript';
    tag.async = true;
    tag.src = src;
    if (callback) {
        tag.onload = callback;
    }
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(tag, s);
};

POSE.Util.readCookie = function(name) {
    var cookies, cookie, i;

    cookies = document.cookie.split('; ');
    POSE.Util.cookies = {};

    for(i = cookies.length - 1; i >= 0; i--){
        cookie = cookies[i].split('=');
        POSE.Util.cookies[cookie[0]] = cookie[1];
    }

    if (typeof POSE.Util.cookies[name] == "undefined") {
        return;
    }

    return decodeURIComponent(POSE.Util.cookies[name]);
};

POSE.Util.setCookie = function setCookie(name, value, expires, path, domain, secure) {
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }

    var expiresDate = new Date(new Date().getTime() + expires);

    document.cookie = name + '=' + encodeURIComponent(value) +
        ((expires) ? ';expires=' + expiresDate.toGMTString() : '') +
        ((path)    ? ';path='    + path                      : '') +
        ((domain)  ? ';domain='  + domain                    : '') +
        ((secure)  ? ';secure'                               : '');
};

setCookie = POSE.Util.setCookie;

POSE.Util.popup = function(url, width, height) {

    if(typeof width == "undefined") {
       width    = 575;  
    }
    
    if(typeof height == "undefined") {
       height   = 440;
    }
    
    var left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        opts   = ',width='  + width  +
            ',height=' + height +
            ',top='    + top    +
            ',left='   + left +
            ',menubar=no,toolbar=no,resizable=yes,scrollbars=yes';

    window.open(url, 'popup', opts);
};

POSE.Util.print = function() {

    if(typeof FDCPLoader == 'undefined') {
        // The callback needs to be done this way since ClearPrintPrintHtml isn't defined
        POSE.Util.require('http://cache-02.cleanprint.net/cpf/cleanprint?key=posevn&polite=no', function() { CleanPrintPrintHtml();});
    } else {
         CleanPrintPrintHtml();
    }
    return false;
    
}

/**
 * Underscore.js 1.5.1 // _.debounce()
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge as well as trailing.
 */
POSE.Util.debounce = function(func, wait, immediate) {
    var result;
    var timeout = null;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
    };
};

POSE.Util.getIframe = function(src, width, height) {
    var tag = document.createElement('iframe');
    tag.setAttribute('seamless', '');
    tag.setAttribute('frameborder', '0');
    tag.setAttribute('scrolling', 'no');
    tag.setAttribute('allowtransparency', 'true');
    tag.width = width;
    tag.height = height;
    tag.src = src;
    return tag;
};

POSE.Console = {
    log: function() {
        if (POSE.Debug && console && console.log && console.log.apply)
            console.log.apply(console, arguments);
    },
    warn: function() {
        if (POSE.Debug && console && console.warn && console.warn.apply)
            console.warn.apply(console, arguments);
    },
    error: function() {
        if (POSE.Debug && console && console.error && console.error.apply)
            console.error.apply(console, arguments);
    }
};
