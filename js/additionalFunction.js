$(function(){
// Show navigation
    $('.navbut').on('click',function(e){
        var nav = $('#nav');
        if(nav.hasClass('active')){
            close_side_nav();
        }
        else open_side_nav();
    });
// Close side navigation
    $('body').on('click', '.mm_bg, #nav .close', function(e){
        e.preventDefault();
        close_side_nav();
    });
// Initiation functions
    var init = function(e){
        toggle_bottom_share_block();
        toggle_scrolltop_but();
        adjust_article_block();
        setTimeout(function(){
            adjust_main_news();
            adjust_teasers_onresize();
        }, 100);
        setTimeout(function(){
            adjust_teasers_onscroll();
        }, 1000);
    }
// Adjusting top navigation hander function
    var naha = function(e){
        if(e.type == 'resize'){
            adjust_main_news();
            adjust_article_block();
            adjust_teasers_onresize();
        }
        else if(e.type == 'scroll'){
            //adjust_header();
            adjust_teasers_onscroll();
            toggle_scrolltop_but();
            toggle_bottom_share_block();
            toggle_left_adblock();
        }
        else if(e.type=='touchmove'||e.type=='orientationchange'||e.type =='gesturechange')
        {
            adjust_header();
            toggle_bottom_share_block();
            adjust_article_block();
        }
        else if(e.target.className == 'su'){
            $('#header').removeClass('fixed');
            $('#top_teasers').removeClass('show');
        }
    }
// Adaptation functions start launch
    $(window).load(init);
// Adaptation functions event triggers
    if(/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)){
        var ev = 'touchmove gesturechange orientationchange click';
        $(window).off(ev, naha).on(ev, naha);
    }
    else{
        var ev = 'resize scroll click';
        $(window).off(ev, naha).on(ev, naha);
    }
// Navigation buttons
    $('#nav .navmc > a').on('click',function(e){
        e.preventDefault();
        open_nested_side_nav(this);
    });

    $('.close_nested').on('click',function(){
        close_nested_side_nav();
    });
// Loading search form
    if($('#search_p').length==1){
        $.get('/article/search_form', function(data){
            if(data)$('body').append(data);
        });
    }
// Star rating
    if($('.jRating').length > 0)
    {
        var url = window.location.href,
            ctr = url.match('/article/')? 'article' : 'news',
            srt = '/'+ctr+'/xhr_save_rating';

        $('.jRating').jRating({
            rateInfosY: -30,
            showRateInfo: false,
            step : true,
            length : 5,
            type : 'big',
            phpPath : srt,
            bigStarsPath: '/misc/icons/stars.png'
        });
    }
// Image share block
    $('#share_img').hover(function(e){
        clearTimeout(window.share_img_to);
    },function(){
        clearTimeout(window.share_img_to);

        window.share_img_jl = true;

        window.share_img_to = setTimeout(function(){
            window.share_img_jl = false;
            $('#share_img').fadeOut(200);
        }, 100);
    });

    $('body').on('mouseenter click', '.fotorama__active img, .body .ide, .body .if', function(){
        if($(this).parent().hasClass('fotorama__thumb')) return false;

        clearTimeout(window.share_img_to);
        if(window.share_img_jl){
            window.share_img_jl = false;
            return false;
        }
        var o = $(this);

        window.share_img_to = setTimeout(function(){
            adjust_share_img(o)
        }, 100);
    });

    $('body').on('mouseleave', '.fotorama__active img, .body .ide, .body .if',function(){
        clearTimeout(window.share_img_to);
        window.share_img_to = setTimeout(function(){
            $('#share_img').fadeOut(200);
            window.share_img_jl = false;
        }, 100);
    });
// Distribute body image name attrs
    $('article img.ide, article img.if').each(function(){
        var o = $(this),
        	pt = o.parent()[0].nodeName.toLowerCase(),
            ii = o.prop('src').replace(/.*\/([0-9]+).*/g,'$1');
		if(pt != 'a')
        o.wrap('<a class="anclink" href="#image'+ii+'" name="image'+ii+'"></a>');
    });
// Disabling floating header on anchor link click
    $('body').on('click','.anclink', function(){
        var img = $(this).find('img');

        setTimeout(function(){
            $('#header').removeClass('fixed');
            $('#top_teasers').removeClass('show');

            adjust_share_img(img);
        }, 100);
    });
// Appending link to copied text
    document.oncopy = addLink;
// Checking AB
    var url = window.location.href ? window.location.href : document.URL,
        art = url.match(/\/(news|article|post)\//),
        act = window._planet_ ? 0:1;
// Saving data
    $.post('/stat/trackab', {'status':act});
// Removing uXIWzsphMVw 240x400 for ab detected
	if(art && document.cookie.indexOf("abmatch=") >= 0){
		$('.sbga, .adsbygoogle').remove();
	}
// Getting new blocks
    if(art && act == 1){
        if(url.match(/\/article\//)){
            $.post('/article/adjust_block', {url:url}, function(data){
                if(!data) return false;
                data = $.parseJSON(data);
            // Distributing new blocks
                $('.uRoKjsoJZCDxhGkMr').each(function(i, v){
                    $(this).find('.gb').replaceWith(data[i]);
                });
            });
        }
        else{
            $('.tb-paired').addClass('tbline').removeClass('tb-paired');
        }
    }
// Video Play
	if(art && window._planet_ && ! window.mobilecheck()){
		setTimeout(function(){check_video(0)}, 100);
	}
// Hide top banner on video display
    window.check_mv_interval = 0;
    var check_mv = setInterval(function(){
        window.check_mv_interval += 100;
        var cont = $('#uVo25s59VeipiBQ'),
            ad = cont.children('yatag'),
            mv = $('#moevid').height();
        if(mv > 100) cont.remove();
        if(window.check_mv_interval > 10000 || mv > 100){
            clearInterval(check_mv);
        }
    },100);
// SlickJ
    if(art && ! window._planet_ && ! window.mobilecheck()){
		$('.uRoKjsoJZCDxhGkMr').eq(1).html('<sjdiv id="SlickJumpNativeAds-cuiwcdj54"></sjdiv>');
		init_sj();
	}
	else if(1 == 2 && url.match(/\/(article)\//) && window._planet_ && ! window.mobilecheck() && $(window).width() > 1000){
		var style = '<style type="text/css">.sj-inject-cuiwcdj54{margin:0 auto !important}.sj-widget-footer{position:absolute !important;right:0;bottom:0}</style>';
		$('.uRoKjsoJZCDxhGkMr').eq(2).prepend(style+'<div class="tb tb-paired" style="max-width:400px;width:400px"><sjdiv id="SlickJumpNativeAds-cuiwcdj54" style="padding:0"></sjdiv></div>');
		init_sj();
	}
// Leadia widget
    setTimeout(function(){
        var aa = $('.aa').length, // Adv article
        	mcat = $('.mcat'),
            mcat = mcat ? mcat.attr('id') : false;
    // Adding leadia ads
        if(art && mcat == 'mc211' && ! window.mobilecheck() && ! aa){
            setTimeout(function(){
				var w = window; w.leadia_custom_param = {"webmaster":{"subaccount":"fbru","product":"lawyer"},
				"widgetStyle":{"position":"right","horizontalMargin":"0"},"presetStyle":"red",
				"cold_field_json":{"active":0},"consultant":{"name":"Александр Юрьевич","jobTitle":"Юрист Онлайн","generateRandom":false}};
                $.getScript('//api.cloudleadia.com/wnew.js?wc=leadia/default/blade&w=4499&p=lawyer&region-filter=true');
            }, 600);
        }
    // Getting height of the first banner
        var fw = $('.article_body').width(),
            hw = (fw - 20) / 2,
            bw = ($(window).width() >= 480) ? hw : fw;
	// TTarget
        if(art && act && $('#uVo25s59VejhhFFQ').height() < 11 && ! aa && ! window.mobilecheck()){
            setTimeout(function(){
                if($('#uVo25s59VejhhFFQ').height() < 11)
                {
                	//$('#mc-container').after('<div class="ttarg"><iframe src="/article/iframe/3" width="686" height="246" frameborder="0"></iframe></div>');
                }
            }, 500);
        }
	// Bottom teasers
        if(false && art && !window.mobilecheck()){
        	$('.mb_frame').html('<iframe src="/article/iframe/5" width="728" height="250" frameborder="0"></iframe>');
        }
    }, 1000);
// Tracking block ctr
    track_teaser_block_ctr();
});

function check_video(wait){
	if(wait >= 20) return false;

	var wr = $('.yap-rtb__wrapper'),
		ww = wr.width(),
		wh = wr.height();

	if(ww != 600 || wh != 5){
		setTimeout(function(){
			check_video(++wait);
		}, 500);
	}else{
    	var url = window.location.href ? window.location.href : document.URL;
		if(url.match(/\/article\//)){
			init_video_play();
			console.log('Video Play init');
		}else if(url.match(/\/(news|post)\//)){
			init_moevideo();
			console.log('Moevideo init');
			$.post('/stat/track_mv',{status:1});
		}
	}
}

function init_video_play(){
// Init video now
    if(window.mobilecheck()) return;

	var frame = '<iframe style="display:block;margin:0 auto" id="adv_kod_frame" src="https://video-play.ru/kod.php?param='
				+'6147377a7630754c734d626b2b4278596473737958724b6b38395339347750316454534d733766344a79353543413d3d" '
			    +'width="600" height="320" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>';
	$('#moevid').html(frame);

	var script = document.createElement("script");
		script.async = true;
		script.type = "text/javascript",
		script.src = 'https://video-play.ru/player_html5/iframeobrabotchik.js';
	var node = document.getElementsByTagName("head")[0];
		node.appendChild(script, node);
	setTimeout(function(){$('#moevid').remove()},60000);
}

function init_moevideo(){
// Checking if already started
    if(window.mobilecheck() || window.mvstarted) return false;
    else window.mvstarted = true;
// Init code
    var w = window;
        w.moevideo = w.moevideo || {};
        w.moevideo.queue = w.moevideo.queue || [];
    (function(){
        var mvads = document.createElement("script");
            mvads.async = true;
            mvads.type = "text/javascript";
        var useSSL = "https:" == document.location.protocol;
            mvads.src = (useSSL ? "https:" : "http:") + "//moevideo.biz/embed/js/mvpt.min.js";
        var node =document.getElementsByTagName("head")[0];
            node.appendChild(mvads, node);
    })();
    w.moevideo.queue.push(function(){
        w.moevideo.ContentRoll({
        	mode:"manual",
        	el:"#moevid",
        	ignorePlayers:true,
        	callback:function(event, el){
        		if(event == 'empty'){
        			console.log('init video-play');
        			init_video_play();
        			$.post('/stat/track_mv',{status:0});
        		}else if(event == 'start'){
        			$.post('/stat/track_mv',{status:2});
        		}else if(event == 'finish'){
        			$.post('/stat/track_mv',{status:3});
        		}
				console.log('Event: '+event);
    		}
       	});
    });
}

function toggle_left_adblock(){
	if($(window).scrollTop() > 300){
		$('.lfga').show();
	}else{
		$('.lfga').hide();
	}
}

function toggle_left_adblock(){
	if($(window).scrollTop() > 300){
		$('.lfga').show();
	}else{
		$('.lfga').hide();
	}
}

function init_sj()
{
    (function(){
       function a(){
           var proto =  ('https:' == document.location.protocol ? 'https' : 'http');
           var a = document.getElementsByTagName("script")[0], sj = document.createElement("script");
           sj.async = !0;
           sj.type = 'text/javascript';
           sj.src = proto + "://sjsmartcontent.org/static/plugin-site/js/sjplugin.js";
           sj.setAttribute("site", "2kw2bxtrzbmiva5g03k");
           a.parentNode.insertBefore(sj, a);
       }
       window.addEventListener ? window.addEventListener("DOMContentLoaded", a, !1) : window.attachEvent ? window.attachEvent("onDomReady", a) : window.onDomReady = a;
    })();
}

function track_teaser_block_ctr()
{
    setTimeout(function(){
    // Defining block object vars
        var w = $(window),
            ww = w.width(),
            wh = w.height(),
            st = $('.uXIWzsphMVw:visible'),
            ft = $('.is_fixed:visible'),
            it = $('.uRoKjsoJZCDxhGkMr .tb:visible'),
            ar = $('.also_read .ab:visible'),
            nr = $('.lastest_news .ab a'),
            ab = window._planet_ ? 0:1,
            url = window.location.href ? window.location.href : document.URL,
            po = {url:url,ab:ab};
    // Sibar teasers active?
        if(st.length && ww > 700) po.uXIWzsphMVw = 1;
    // In text teasers?
        if(it.length) po.intext = it.length;
    // Article blocks
        if(ar.length || nr.length) po.block = 1;
    // Tracking view
        $.post('/stat/track_tb', po);
    // Tracking clicks
        $('.uXIWzsphMVw .featured_article a').on('click',function(e){
            e.preventDefault();
            var link = $(this).attr('href'),
                cls = $(this).closest('.is_fixed'),
                type = cls.length ? 'fixed' : 'uXIWzsphMVw';
            $.post('/stat/track_tb',{tb:type,url:url,ab:ab},function(){
                //window.location.href = link;
            });
        });
        $('.uRoKjsoJZCDxhGkMr .tb a').one('click', function(e){
            e.preventDefault();
            var link = $(this).attr('href');
            $.post('/stat/track_tb',{tb:'intext',url:url,ab:ab},function(){
                //window.location.href = link;
            });
        });
        $('.also_read .ab a, .lastest_news .ab a').one('click', function(e){
            e.preventDefault();
            var link = $(this).attr('href');
            $.post('/stat/track_tb',{tb:'block',url:url,ab:ab},function(){
                //window.location.href = link;
            });
        });
    }, 500);
}

function fbload()
{
    $('body').prepend('<div id="fb-root"></div>');
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.5";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function addLink()
{
    var d = document, w = window,
        elt = d.getElementsByClassName('article_body')[0],
        sel = w.getSelection(),
        url = d.location.href,
        pgl = " - Читайте подробнее на FB.ru: <a href='"+url+"'>"+url+"</a>",
        cpt = sel + pgl,
        div = d.createElement('div');
    div.style.position='absolute';
    div.style.left='-99999px';
    elt.appendChild(div);
    div.innerHTML = cpt;
    sel.selectAllChildren(div);
    w.setTimeout(function() {
        elt.removeChild(div);
    },0);
}

function adjust_teasers_onresize()
{
// Arternative method for Ipad
    if(navigator.userAgent.match(/iPad/i) != null){
       //return false;
       return adjust_teaser_block();
    }
// Defining vars
    var w = $(window),
        th=0, eq,
        ws = w.scrollTop(),
        ww = w.width(),
        wh = w.height(),
        ao = ww > 800 && $('.sbga').height() >= 200, // Ad offset
        mh = ao ? wh - 580 : wh - 280, // 180 optimal
        sb = $('.uXIWzsphMVw'),
        ts = sb.find('.featured_article'),
        lt = $('.lastest_news'),
        tt = ts.length,
        fx = $('.is_fixed'),
        nf = $('.notfixed'),
        fx = (fx.length==0)? nf : fx,
        ft = $('.sbft');
// Checking IF teaser block exists
    if(ts.length==0 || !sb.is(":visible")) return false;
// Clearing previous timeout
    clearTimeout(window.rtbt);
// Setting timeout
    window.rtbt = setTimeout(function(){
    // Deleting previous fixed block
        //if(fx.length > 0) fx.replaceWith(ft.html());
        if(fx.length > 0){
            var tfirst = ft.children('.featured_article:first');
            if(tfirst.length>0) tfirst.unwrap().unwrap().unwrap();
            else fx.remove();
        }
    // Adding news fixed teasers block
        var html = '<div class="notfixed"><div class="cont">'
                   +'<div class="sbft"></div></div></div>';
        sb.append(html);
    // Removing previous styles
        ts.removeAttr('style');
    // Determining how many will fit
        $(ts.get().reverse()).each(function(i,o){
            th += $(this).outerHeight(true);
            eq = tt - i - 1;
            if(th > mh) return false;
            ts.eq(eq).prependTo('.sbft');
        });
    // Adjusting scroll
        adjust_teasers_onscroll();
    }, 100);
}

function adjust_teasers_onscroll()
{
// Arternative method for Ipad
    if(navigator.userAgent.match(/iPad/i) != null){
       // return false;
       return adjust_teaser_block();
    }
// Defining vars
    var w = $(window),
        ws = w.scrollTop(),
        fx = $('.is_fixed'),
        nf = $('.notfixed'),
        fx = (fx.length==0)? nf : fx,
        sb = $('.uXIWzsphMVw'),
        ts = sb.children('.featured_article:last'),
		aj = ($('.sbga').height() >= 200 && w.width() > 800) ? 400 : 0, // Adjustment
        lt = $('.lastest_news');
// Checking IF teaser block exists
    if(fx.length==0 || !fx.is(":visible")) return false;
// Removing previous styles
    fx.removeClass('abs').removeAttr('style');
// Fixed block offset top
    var to = ts.length ? ts.offset().top + ts.height() : sb.offset().top;
// Calculating max margin top
    if(lt.length > 0)
    {
        var lo = lt.offset().top,
            mm = lo - fx.find('.sbft').height() - aj - 5,
            mt = mm - sb.offset().top;
    }
    else mm = ws;
// Element to move
    if(ws >= to && ws <= mm){
    	fx.attr('class','is_fixed');
    	$('.sbga').css({'position':'fixed','top':0});
    	$('.is_fixed .sbft').css({'margin-top':aj+'px'});
    }
    else if(ws >= to){
    	fx.attr('class','is_fixed').addClass('abs').css({'top':mt});
    }
    else{
    	fx.attr('class','notfixed');
    	$('.sbga, .sbft').removeAttr('style');
    }
}

function adjust_teaser_block()
{
// Defining vars
    var w = $(window),
        th=0, eq,
        ws = w.scrollTop(),
        wh = w.height(),
        mh = wh - 220,
        sb = $('.uXIWzsphMVw'),
        ts = sb.find('.featured_article'),
        lt = $('.lastest_news'),
        tt = ts.length;
// Checking IF teaser block exists
    if(tt==0) return false;
// Removing previous styles
    ts.removeAttr('style');
// Determining how many will fit
    $(ts.get().reverse()).each(function(i,o){
        th += $(this).outerHeight(true);
        eq = tt - i - 1;
        if(th > mh) return false;
    });
// Calculating margin top
    var ot = ts.eq(eq).offset().top,
        mt = ws - ot + 5;
// Calculating max margin top
    if(lt.length > 0)
    {
        var lo = lt.offset().top,
            mm = lo - th - ot + 5,
            mt = mt > mm ? mm : mt;
    }
// Element to move
    if(ws >= ot)
    //ts.eq(eq).animate({'margin-top':mt}, 300, "linear");
    ts.eq(eq).css({'margin-top':mt});
}

function adjust_article_block()
{
    $('article.ab .preview img').one('load', function(){
            var a = $(this).closest('.ab'),
                d = a.find('.data'),
                i = $(this),
                dot = i.position().top + i.height(),
                dot = Math.round(dot + 10);
            d.css({top:dot});
    }).each(function(i){
        if(this.complete)
        {
            var a = $(this).closest('.ab'),
                d = a.find('.data'),
                i = $(this),
                dot = i.position().top + i.height(),
                dot = Math.round(dot + 10);
            d.css({top:dot});
        }
    });
}

function adjust_main_news()
{
// Removing previous heights
    $('.mn').find('.bn, .sn').removeAttr('style');
// Defining vars
    var ww = $(window).width(),
        mn = $('.mn'),
        bn = mn.find('.bn'),
        sn = mn.find('.sn'),
        sh = Math.round(sn.height());
// Checking IF exists
    if(mn.length==0 || ww <= 550) return false;
// Adjusting main news image height
    sn.height(sh)
    bn.height(sh*2);
}

function toggle_bottom_share_block()
{
    if($('.share_block').length==0) return false;
// Defining vars
    var w = $(this),
        wst = w.scrollTop(),
        dh = $(document).height(),
        fh = $('#footer').height(),
        to = wst + w.height(),
        lefttobot = dh - to,
        tsb = $('.share_block'),
        tsb_ot = tsb.offset().top + tsb.height(),
        ab = $('.body'),
        ab_ot = ab.offset().top + ab.height();
// Determining IF article body && top share block is visible
    if(wst > tsb_ot && wst < ab_ot && lefttobot > fh) $('.fsb').addClass('rollup');
    else $('.fsb').removeClass('rollup');
}

function toggle_scrolltop_but()
{
    var wst = $(this).scrollTop();
        but = $('#scrolltop'),
        func = (wst > 200)? 'show':'hide';
    but[func]();
}

function open_nested_side_nav(obj)
{
    var ob = $(obj),
        nm = ob.parent(),
        ul = ob.find('ul');
// Loading sub categories
    if(!ul.length){
        var re = /.+\/([0-9]+)\/.+/g,
            lu = ob.attr('href'),
            id = lu.replace(re,'$1').st(),
            po = {id:id};
        $.post('/home/load_nav_subcat', po, function(data){
            if(data) nm.find('.smw').append(data);
        });
    }
// Displaying sub category
    nm.find('.navsc').css({'left':0});
}

function close_nested_side_nav()
{
    $('#nav .navsc').css({'left':-285});
}

function adjust_share_img(obj)
{
    var shm = $('#share_img'),
        mt = obj.css("margin-top"),
        mt = parseInt(mt),
        ml = obj.css("margin-left"),
        ml = parseInt(ml),
        ot = obj.position().top + mt,
        ol = obj.position().left + ml,
        iu = obj.attr('src');
    obj.after(shm);
    shm.fadeIn(200);
    shm.css({'top':ot,'left':ol});
// Change data image to selected one
    //var page_url = obj.parent().prop('href');

    var ii = obj.prop('src').replace(/.*\/([0-9]+)[_.].*/g,'$1'),
        iu = obj.prop('src'),
        pu = location.href.replace(/\?.*$/g,'').replace(/\#.*$/g,''),
        pu = pu+'?image='+ii+'#image'+ii;
    shm.find('.goodshare').data('image', iu);
    shm.find('.goodshare').data('url', pu);
}

function adjust_header()
{
// Defining vars
    var w           = $(this),
        wst         = w.scrollTop(),
        direction   = 0,
        top         = 5,
        nav         = $('#nav'),
        wrp         = $('#wrapper'),
        hd          = $('#header'),
        ct          = hd.find('.ct'),
        pop         = $('#popup').length,
        pnl         = $('.abs_panel').is(":visible"),
        tt          = $('#top_teasers');
// Side nav or popup check
    if(nav.hasClass('active') || pop || pnl){
        return false;
    }
// Determining scroll direction
    direction =  wst - window.scrltop;
// Checking IF branding advertising is on
    if($('#wrapper').hasClass('branding')){
        top = 200;
    }
// Less than min scrolltop
    if(wst <= top){
        wrp.removeClass('fxhead');
        tt.removeClass('show');
        return false;
    }
// Displaying floating header
    if(wrp.hasClass('fxhead')){
        if(direction > 10){
            wrp.removeClass('fxhead');
            tt.removeClass('show');
        }
        else if(direction < -50 && w.width() > 550 && w.height() > 400){
            tt.addClass('show');
        }
        if(wst <= top+30){
            tt.hide(0).removeClass('show').show(0);
        }
    }
    else if(wst >= top && direction < -50){
        wrp.addClass('fxhead');
        if(w.width() > 550 && w.height() > 400){
            tt.addClass('show');
        }
    }
// Updating scroll top value
    window.scrltop = wst;
}

function adjust_nav()
{
// Defining vars
    var w = $(this),
        d = $(document),
        dh = d.height(),
        wst = w.scrollTop(),
        wh = w.height(),

        n = $('#nav'),
        nh = n.height(),
        not = n.offset().top;

        nb = n.find('.nb'),
        nbh = nb.height(),
        nbw = nb.width(),

        fot = dh - $('#footer').offset().top,
    // Minimum offset for sliding bottom to start
        whentobot = nbh + not - wh,
        bot_adjust = wst - (nbh - wh) - not,
        max_offset = dh - nbh - fot - not - 20, // 20px margin bottom
        available_space = wh - not,
        tobotadjust = available_space > nbh ? wst : bot_adjust,
        tobotadjust = tobotadjust > max_offset ? max_offset : tobotadjust,
    // To top
        whentotop =  nb.offset().top,
        totopadjust = wst,
    // Adjust close but
        $('.close').css('top', wst+'px');
// Adjusting offset top
    if(! window.scrltop)
    {
       nb.css('top', totopadjust+'px');
    }
    else if(wst > window.scrltop && wst > whentobot)
    {
        nb.css('top', tobotadjust+'px');
    }
    else if(window.scrltop >= wst && whentotop > wst)
    {
        nb.css('top', totopadjust+'px');
    }

    window.scrltop = wst;
}

function open_side_nav()
{
    var nav = $('#nav'),
        wrapp = $('#wrapper'),
        mmbg_html = '<div class="mm_bg"></div>',
        h = $('#header'),
        hb = $('#header_baners'),
        w = $(this),
        wst = w.scrollTop(),
        fx = $('.is_fixed'),
        nf = $('.notfixed'),
        tfx = (fx.length==0)? nf : fx,
        fsb = $('.fsb '),
        site = $('.site'),
        rt = $('#teaser');
// Navigation shadow
    wrapp.prepend(mmbg_html);
    $('.mm_bg').css('opacity',0).show().animate({
        opacity: 0.5,
    }, 200);
// Adding nac class
    nav.addClass('active');
// Adjusting left offset
    if(site.offset().left < nav.width()){
        site.css({'left':nav.width() - site.offset().left});
        h.css({'left':nav.width() - site.offset().left});
    // Hiding fixed teaser and share block
        if(tfx.length) tfx.hide();
        if(fsb.length) fsb.hide();
    }
}

function close_side_nav()
{
    var nav = $('#nav'),
        h = $('#header'),
        w = $(this),
        wst = w.scrollTop(),
        hb = $('#header_baners'),
        fx = $('.is_fixed'),
        nf = $('.notfixed'),
        tfx = (fx.length==0)? nf : fx,
        fsb = $('.fsb '),
        site = $('.site'),
        rt = $('#teaser');
// Deactivationg nav
    nav.removeClass('active');
    $('.mm_bg').remove();
// Adjusting left offset
    site.css({'left':'0'});
    h.css({'left':'0'});
// Closing nested nav
    close_nested_side_nav();
// Display blocks
    setTimeout(function(){
        if(tfx.length) tfx.show();
        if(fsb.length) fsb.show();
    }, 300);
}
