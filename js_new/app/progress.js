POSE.Progress = new function () {
    var self = this,
        value = 0, // percent
        started = false,
        $container = null,
        $progressBar = null,
        timer = null;

    this.init = function() {
        $container = $('#loadingContainer');
        $progressBar = $('#loadingBarProgress');
    };

    this.start = function() {
        started = true;
        $container.removeClass('done')
                  .show();

        setTimeout(function(){
            self.set(10);
            timer = window.setInterval(function() {
                var multiplier = 40;
                if (value >= 80) {
                    multiplier = 1;
                }
                self.increment(Math.random() * multiplier);
            }, 500);
        }, 100);
    };

    this.set = function(val) {
        if (val >= 100) {
            val = 100;
            if (timer) {
                window.clearInterval(timer);
            }
        }

        value = parseFloat(val).toFixed(2);

        $progressBar.css('width', value + '%');
    };

    this.increment = function(val) {
        self.set(parseFloat(value) + val);
    };

    this.done = function() {
        if ( ! started) {
            return;
        }
        
        if(POSE.Aside.status == 'OPENED') {
            POSE.Aside.close();
        }
        
        self.set(100);
        started = false;

        window.clearInterval(timer);

        $container.addClass('done');

        window.setTimeout(function() {
            if ( ! started) {
                $container.hide();
                self.set(0);
            }
        }, 1000);
    };
};
