var $imgCt = $('.img-ct'),
    $preBtn = $('.btn-pre'),
    $nextBtn = $('.btn-next'),
    $bullet = $('.bullet');
var $firstImg = $imgCt.find('li').first(),
    $lastImg = $imgCt.find('li').last();

var curPageIndex = 0;
var imgLength = $imgCt.children().length;
var isAnimate = false;

$imgCt.prepend($lastImg.clone())
$imgCt.append($firstImg.clone())

$imgCt.width($firstImg.width() * $imgCt.children().length)
$imgCt.css('left', '-300px')

$preBtn.on('click', function () {
    playPre();
})
$nextBtn.on('click', function () {
    playNext();
})

function playNext(idx) {
    idx = idx || 1;
    if (isAnimate) return;
    isAnimate = true;
    $imgCt.animate({
        left: '-=300'
    }, function () {
        curPageIndex++;
        if (curPageIndex === imgLength) {
            $imgCt.css({
                'left': '-300px'
            })
            curPageIndex = 0;
        }
        isAnimate = false;
        setBullet();
    })
}

function playPre(idx) {
    idx = idx || 1;
    if (isAnimate) return;
    isAnimate = true;
    $imgCt.animate({
        left: '+=300'
    }, function () {
        curPageIndex--;
        if (curPageIndex < 0) {
            $imgCt.css('left', 0 - (imgLength * $firstImg.width()));
            curPageIndex = imgLength - 1
        }
        isAnimate = false;
        setBullet();
    })
}

function setBullet() {
    $bullet.children()
        .removeClass('active')
        .eq(curPageIndex)
        .addClass('active')
}