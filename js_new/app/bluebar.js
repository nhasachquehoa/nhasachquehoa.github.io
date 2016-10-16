POSE.BlueBar = new function() {
    var self = this;
    
    this.init = function() {
        POSE.Event.listen(POSE.EVENTS.CLICK, self.toggleBlueBarMenu, '.tiny #bluebar');
    };
    
    this.toggleBlueBarMenu = function() {
        $('#bluebar').toggleClass('open');
    };
};
