var url = window.location.href ? window.location.href : document.URL,
    plt = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent),
    evt = plt ? 'touchmove' : 'scroll',
    actions = [],
    teaser_views = [],
    teaser_clicks = [],
    date = (!Date.now) ? Date.now : new Date().getTime(),
    tmst = Math.floor(date/1000),
    selector = '.featured_article, .abt',
    timeout = 3000,
    desturl = false,
    timer;

$(function(){
    $(document).on(evt, function(){
        getActions('view');
    });
    $(selector).on('click', function(e){
        e.preventDefault();
        getActions('click', this);
    });
    getActions('view');
});

getActions = function(action, obj){
    if(action == 'view'){
        $(selector).each(function(){
            if ($(this).isOnScreen()){
                var id = $(this).attr('id').replace(/[^0-9]/g,'');
                if (!teaser_views[id]) {
                    actions.push({'id':id,'view':1,'click':0});
                    teaser_views[id] = 1;
                    clearTimeout(timer);
                    timer = setTimeout('sendRequest()', timeout);
                }
            }
        });
    }
    else if(action == 'click'){
        var id = $(obj).attr('id').replace(/[^0-9]/g,'');
        desturl = $(obj).find('a').attr('href');
        if (!teaser_clicks[id]){
            actions.push({'id':id,'view':0,'click':1});
            teaser_clicks[id] = 1;
            clearTimeout(timer);
            sendRequest(desturl);
        }
    }
};

$.fn.isOnScreen = function(){
	var viewport = {},
		bounds = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top) && ($(this).is(':visible')));
};

sendRequest = function(desturl){
    var request = {'teasers': actions, 'desturl': desturl};

    $.ajax({
        type: 'POST',
        url: '/stat/tracker',
        dataType: 'text',
        data: {data : JSON.stringify(request)},
        success: function(responseData, textStatus){
            actions.length = 0;
            if(desturl) window.location.href = desturl;
        }
    });
}
