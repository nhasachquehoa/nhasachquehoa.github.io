$(document).ready(function() {
    if ( POSE.Obj.pageType == "Channel" && $('body').hasClass('noSlider') ) {
        $('#welcomeMatContainer').addClass('special-animated');
    //    $('#channelTiles').addClass('special-tiles-history');
       // $('.articleTile:eq(0)').append('<div class="latest-feature">LATEST <span>FEATURE</span></div>');
       // $('#welcomeMatContainer').append('<div class="historyIconLeft"></div><div class="historyIconRight"></div>');
    };

    var curChannel = POSE.Meta.get('idChannel');
    if(curChannel == '25264') {
    	$('#welcomeMatContainer').addClass('special-nine-shop');	
    }
});
