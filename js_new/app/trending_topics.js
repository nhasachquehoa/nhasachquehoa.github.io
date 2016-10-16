POSE.TrendingTopics = new function() {
    var self = this;
    
    this.init = function() {
        POSE.Event.listen(POSE.EVENTS.CLICK, self.toggleTrendingMenu, '.tiny #trending-topics');
    };
    
    this.toggleTrendingMenu = function() {
        $('#trending-topics').toggleClass('open');
    };
};
