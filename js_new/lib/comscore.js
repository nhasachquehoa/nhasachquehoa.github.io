var COMSCORE = {beacon: function (p) {
    var v = 1.3, d = document, l = d.location, e = function (c) {
        return c != null ? escape(c) : ""
    };
    (new Image()).src = [(l.protocol == "https:" ? "https://sb" : "http://b"), ".scorecardresearch.com/b?", "c1=", e(p.c1), "&c2=", e(p.c2), "&c3=", e(p.c3), "&c4=", e(p.c4), "&c5=", e(p.c5), "&c6=", e(p.c6), "&c15=", e(p.c15), "&c7=", e(l.href), "&c8=", e(d.title), "&c9=", e(d.referrer), "&cv=", v, "&rn=", Math.random()].join("")
}};
