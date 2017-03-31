
$('.btn').on('click', function () {
    $(this).css({ 'background-color': 'red' });
    setTimeout(function () {
        $('.btn').css({ 'background-color': 'blue' });
    }, 500)
})

$('.rollbox').on('scroll', function () {
    var roll = $('.rollbox').scrollTop()
    $('.distance').text(roll + 'PX')
})

$('.discoloration').on('mouseenter', function () {
    $(this).css({ 'background-color': 'red' });
})
$('.discoloration').on('mouseleave', function () {
    $(this).css({ 'background-color': '#fff' });
})

$('.txt').on('focus', function () {
    $(this).css({ 'outlineColor': 'blue' })
})
$('.txt').on('keydown', function () {
    $(this).val($(this).val().toUpperCase());
});
$('.txt').on('keyup', function () {
    $(this).val($(this).val().toUpperCase());
});
$('.txt').on('focusout', function () {
    console.log($(this).val());
});

$('.choose').on('change', function () {
    var choosetxt = $('.choose option:selected').text()
    $('.choosetxt span').text(choosetxt)
})










