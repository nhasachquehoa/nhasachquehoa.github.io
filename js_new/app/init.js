var POSE = POSE || {};
POSE.Obj = {};
POSE.Obj.screen = {};
POSE.Obj.scrollType = false;
POSE.Obj.pageType = "";
POSE.Obj.idChannel = "";
POSE.currentIndex = 0;
POSE.snapLevels = ['TINY', 'SMALL', 'NORMAL', 'LARGE'];
POSE.realSubDomain = '';POSE.subDomain;
POSE.headerHeight = 45;

$(document).ready(function() {
	
    POSE.Obj.pageType = $('meta[name="type_of"]').attr('content');
	POSE.Obj.idChannel = $('meta[name="idChannel"]').attr('content');

    POSE.Event.init();
    POSE.History.init();
//    POSE.Analytics.init();
    POSE.Event.setMode();
	//POSE.RespAds.init();
    POSE.Event.fire(POSE.EVENTS.PAGE_READY);
    POSE.Event.fire(POSE.EVENTS.META_LOADED);
    POSE.Menu.init();

    if (POSE.Obj.pageType != "")
    {
        switch (POSE.Obj.pageType) {
            case 'Channel':
			case 'Event':
				//POSE.BlueBar.init();
				POSE.ChannelLoad.init();
				
				
            case 'Archive':
			case 'ArticleDetail':
				POSE.ChannelLoad.setTileSize;
			case 'Post':
				POSE.ChannelLoad.init();
				POSE.Aside.init();
			case 'Subcat':
                POSE.ChannelLoad.init();
                //$("#asideToggle").hide();
                break;
			case 'Cat':
                POSE.ChannelLoad.init();
				if(POSE.Obj.idChannel == 2){
					POSE.BlueBar.init();
				}
                //$("#asideToggle").hide();
                break;
            case 'Homepage':
                POSE.ChannelLoad.init();
                $("#asideToggle").hide();
                break;
            case "Article":
            case "Video":
            case "Gallery":
                POSE.PageLoad.init();
                POSE.Progress.init();
               // POSE.Menu.resize();
                POSE.Aside.init();
                $('.theArticle').addClass('cleanprint-article'); // Required for cleanPrint to work properly
                break;
        }
    }
    POSE.TrendingTopics.init();
//    POSE.MyMagazine.init();
    POSE.Plus.init();
    POSE.Video.init();
    POSE.Event.resizeWindow();
});

$(window).load(function() {
    POSE.Event.fire(POSE.EVENTS.PAGE_LOADED);
});
function facebookPopup (url) {popup = window.open(url, "facebook_popup","width=620,height=400,status=no,scrollbars=no,resizable=no");popup.focus();}
