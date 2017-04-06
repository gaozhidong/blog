var $img = $('.img')
            , $items = $img.children()
            , $back = $('.btn-l')
            , $next = $('.btn-r')
            , $bullet = $('.choose')
            , imgCount = $items.size();
        var curIdx = 0;
        var isAnimate = false;
        $next.on('click', function () {
            playNext();
        });
        $back.on('click', function () {
            playBack();
        });
        $bullet.find('li').on('click', function () {
            var idx = $(this).index();
            play(idx);
        });
        play(0);
        autoPlay();
        function play(idx) {
            if (isAnimate) return;
            isAnimate = true;
            $items.eq(curIdx).fadeOut(500);
            $items.eq(idx).fadeIn(500, function () {
                isAnimate = false;
            });
            curIdx = idx;
            choose();
        }
        function autoPlay() {
            clock = setInterval(function () {
                playNext()
            }, 2000)
        }
        function playNext() {
            play((curIdx + 1) % imgCount)
        }
        function playBack() {
            play((curIdx + imgCount - 1) % imgCount)
        }
        function stopAuto() {
            clearInterval(clock);
        }
        function choose() {
            $bullet.children().removeClass('active').eq(curIdx).addClass('active')
        }