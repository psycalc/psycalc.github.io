(function($, document, window, undefined) {
    $(document).ready(function() {
        goodshare = {
            doit: function(_element, _options) {
                var self = goodshare,
                    options = $.extend({
                        type:   'vk',
                        url:    location.href,
                        title:  document.title,
                        image:  $('meta[property="og:image"]').attr('content'),
                        text:   $('meta[name="description"]').attr('content').substr(0, 100)+'...'
                    },
                    $(_element).data(), _options);
                if (self.popup(link = self[options.type](options)) === null) {
                    if ($(_element).is('a')) {
                        $(_element).prop('href', link);
                        return true;
                    }
                    else {
                        location.href = link;
                        return false;
                    }
                }
                else {
                    return false;
                }
            },
            vk: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    image:  '',
                    text:   ''
                }, _options);
                return 'https://vk.com/share.php?'
                    + 'url='          + encodeURIComponent(options.url)
                    + '&title='       + encodeURIComponent(options.title)
                    + '&description=' + encodeURIComponent(options.text)
                    + '&image='       + encodeURIComponent(options.image)
                    + '&noparse=true';
            },
            ok: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    text:   ''
                }, _options);
                return 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1'
                    + '&st.comments=' + encodeURIComponent(options.text)
                    + '&st._surl='    + encodeURIComponent(options.url);
            },
            fb: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    image:  '',
                    text:   ''
                }, _options),
                fb_first_param = window.mobilecheck() ? 'm2w&s' : 's';

                return 'http://www.facebook.com/sharer.php?'+fb_first_param+'=100'
                    + '&p[title]='     + encodeURIComponent(options.title)
                    + '&p[summary]='   + encodeURIComponent(options.text)
                    + '&p[url]='       + encodeURIComponent(options.url)
                    + '&p[images][0]=' + encodeURIComponent(options.image);
            },
            lj: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://livejournal.com/update.bml?'
                    + 'subject='        + encodeURIComponent(options.title)
                    + '&event='         + encodeURIComponent('<a href="' + options.url + '">' + options.title + '</a> ' + options.text)
                    + '&transform=1';
            },
            tw: function(_options) {
                var options = $.extend({
                    url:        location.href,
                    title:      document.title
                }, _options);
                return 'http://twitter.com/share?'
                    + 'text='      + encodeURIComponent(options.title)
                    + '&url='      + encodeURIComponent(options.url);
            },
            gp: function(_options) {
                var options = $.extend({
                    url:    location.href
                }, _options);
                return 'https://plus.google.com/share?url='
                    + encodeURIComponent(options.url);
            },
            mr: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    image:  '',
                    text:   ''
                }, _options);
                return 'http://connect.mail.ru/share?'
                    + 'url='          + encodeURIComponent(options.url)
                    + '&title='       + encodeURIComponent(options.title)
                    + '&description=' + encodeURIComponent(options.text)
                    + '&imageurl='    + encodeURIComponent(options.image);
            },
            li: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://www.linkedin.com/shareArticle?mini=true'
                    + '&url='       + encodeURIComponent(options.url)
                    + '&title='     + encodeURIComponent(options.title)
                    + '&summary='   + encodeURIComponent(options.text);
            },
            tm: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://www.tumblr.com/share/link?'
                    + 'url='            + encodeURIComponent(options.url)
                    + '&name='          + encodeURIComponent(options.title)
                    + '&description='   + encodeURIComponent(options.text);
            },
            bl: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'https://www.blogger.com/blog-this.g?'
                    + 'u='  + encodeURIComponent(options.url)
                    + '&n=' + encodeURIComponent(options.title);
            },
            pt: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'https://www.pinterest.com/pin/create/button/?'
                    + 'url='            + encodeURIComponent(options.url)
                    + '&description='   + encodeURIComponent(options.title);
            },
            en: function(_options) {

                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'https://www.evernote.com/clip.action?'
                    + 'url='    + encodeURIComponent(options.url)
                    + '&title=' + encodeURIComponent(options.title)
                    + '&body='  + encodeURIComponent(options.text + '<br/><a href="' + options.url + '">' + options.title + '</a>');
            },
            di: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://digg.com/submit?'
                    + 'url='    + encodeURIComponent(options.url)
                    + '&title=' + encodeURIComponent(options.title);
            },
            yz: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://zakladki.yandex.ru/newlink.xml?'
                    + 'url='    + encodeURIComponent(options.url)
                    + '&name='  + encodeURIComponent(options.title)
                    + '&descr=' + encodeURIComponent(options.text);
            },
            rd: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://www.reddit.com/submit?'
                    + 'url='    + encodeURIComponent(options.url)
                    + '&title=' + encodeURIComponent(options.title);
            },
            sb: function(_options) {
                var options = $.extend({
                    url:    location.href,
                    title:  document.title,
                    text:   ''
                }, _options);
                return 'http://surfingbird.ru/share?'
                    + 'url='    + encodeURIComponent(options.url)
                    + '&title=' + encodeURIComponent(options.title);
            },
            popup: function(url) {
                return window.open(url, '', 'toolbar=0,status=0,scrollbars=1,width=626,height=436');
            }
        };
        $(document).on('click', '.goodshare', function(event) {
            event.preventDefault();
            goodshare.doit(this);
        });
    });
})(jQuery, document, window);
