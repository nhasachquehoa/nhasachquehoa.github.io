POSE.Menu = new function() {

	var self = this;
    this.selector = '#leftMenu';
    this.container = null;
    this.isOpen = false;
    this.isFloating = false;
    this.snapAt = 1104;

    this.init = function() {
    
        self.container = $(self.selector);
        
        POSE.Event.listen(POSE.EVENTS.RESIZE, self.resize);
        POSE.Event.listen(POSE.EVENTS.CLICK,  self.activateSubmenu);
        POSE.Event.listen(POSE.EVENTS.CLICK,  self.toggle, '#menuToggle');
        POSE.Event.listen(Modernizr.touch ? POSE.EVENTS.TOUCH_START : POSE.EVENTS.CLICK,
                        self.clickOutside);
    };

    this.open = function() {        
        $(self.selector).addClass('open');
        $('body').addClass('leftMenuOpen');
		$('.addmenu').removeClass('show');
		$('.addmenu').addClass('hide');
		$('#menuToggle .icon').html('<img src="/images/i_close.png"><span class="txtmenu"> CLOSE</span>');
        $('#menuToggle').addClass('channelMenuActive');
        self.isOpen = true;
    };

    this.close = function() {
		/*
        if ( ! self.isFloating) {
            return;
        }
		*/
		
        $(self.selector).removeClass('open');
        self.closeSubmenus();
		$('.addmenu').removeClass('hide');
		$('.addmenu').addClass('show');
		$('#menuToggle .icon').html('<img src="/images/i_menu.png"><span class="txtmenu"> MENU</span>');
        $('#menuToggle').removeClass('channelMenuActive');
        //$('body').removeClass('leftMenuOpen');
        self.isOpen = false;
    };

    this.closeSubmenus = function() {
        if ( ! self.isOpen) {
            return;
        }

         $(self.selector + ' .open').removeClass('open');
    };

    this.toggle = function() {
		//alert(self.isOpen);
		//self.close();
         if (self.isOpen) {
            self.close();
			//alert('closed');
        } else {
            self.open();
        }
    };

    this.activateSubmenu = function(e) {
        if ( ! self.isOpen || ! self.isFloating) {
            return;
        }

        var target = $(e.target);

        if (target.closest(self.selector).length == 1 && target.hasClass('activateSubmenu')) {
            self.closeSubmenus();
            target.parent().addClass('open');
            return false;
        }
    };

    this.clickOutside = function(e) {
        if ( ! self.isOpen || ! self.isFloating) {
            return;
        }

        var target = $(e.target),
            opened = $(self.selector + ' .open');

        if (target.is('#menuToggle') || target.closest('#menuToggle').length > 0) {
            // close is handled elsewhere
            return;
        }

        if (target.closest(self.selector).length == 0) {
            if (opened.length == 0) {
                self.close();
            } else {
                opened.removeClass('open');
            }
            e.preventDefault();
            e.stopPropagation();
        } else {
            if (target.closest(self.selector + ' .submenu').length == 1
                && ! target.is('a')) {
                opened.removeClass('open');
            }
        }
    };

    this.resize = function() {
        if (POSE.Obj.screen['width'] < self.snapAt) {
            self.isFloating = true;
            $('body').addClass('leftMenuFloat')
                     .removeClass('leftMenuInline');
            $('#menuToggle').show();
			$('.addmenu').hide();
            self.close();
        } else {
            self.isFloating = false;
            $('body').addClass('leftMenuInline');
                    // .removeClass('leftMenuFloat');
            $('#menuToggle').show();
			$('.addmenu').show();
            self.close();
        }
    };
};
