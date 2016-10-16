POSE.Countdown = new function() {
    var self            = this,
        digit           = 0,
        countdown       = null,
        started         = false;

    self.delay          = 5; // in seconds
    self.showDigit      = true;
    self.targetDiv      = '.countdown';
    
    self.init = function(targetDivArg) {
        if (typeof targetDivArg !== 'undefined') { 
            self.targetDiv = targetDivArg;
        }
        
        try {
           $(self.targetDiv).append('<div class="countdown__spinner"></div>');
           if (self.showDigit) {
               $(self.targetDiv).append('<div class="countdown__digit"></div>');
           }
           POSE.Event.fire('COUNTDOWN_INITIALIZED');
        } catch(err) {
            console.log(err);
            return;
        }
        self.reset();
    };
    
    self.start = function() {
        started = true;
        POSE.Event.fire('COUNTDOWN_START');
        countdown = setInterval( function() {
            if (digit <= 0) {
                self.stop();
                POSE.Event.fire('COUNTDOWN_FINISHED');
            } else {
                digit--;
                $('.countdown__digit').html(digit);
            }
        }, 1000);
    };
    
    self.stop = function() {
        started = false;
        if (countdown) clearInterval(countdown);
        POSE.Event.fire('COUNTDOWN_STOP');
    };
    
    self.reset = function() {
        $('.countdown__digit').html(self.delay);
        digit = self.delay;
        POSE.Event.fire('COUNTDOWN_RESET');
    };
    
    self.toggle = function() {
        (started) ? self.stop() : self.start();
    };
};
