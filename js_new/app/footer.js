POSE.Footer = new function(){
    this.init = function() {
        var $footer = $('#footer');

        POSE.Event.listen(POSE.EVENTS.CLICK, function() {
            $footer.toggleClass('open');
        }, '.expanded .toggle, .collapsed', '#footer');

        POSE.Event.listen(POSE.EVENTS.CLICK, function() {
            var $parent = $(this).closest('ul');
            $parent.toggleClass('open');
            $footer.find('.expanded .open').not($parent).removeClass('open');
        }, '.expanded .title', '#footer');

        var $form =  $footer.find('form');
        $form.on('submit', function(event) {
            POSE.API.call('newsletters/signup.json', $form.serialize(), function(data) {
                if (data) {
                    $form.fadeOut(200, function() {
                        $form.parent().find('.success').show();
                    });
                } else {
                    $form.fadeOut(200, function() {
                        $form.parent().find('.error').fadeIn().delay(3000).fadeOut(function() {
                            $form.fadeIn();
                        });
                    });
                }
            });
            event.preventDefault();
        });
    };
};
