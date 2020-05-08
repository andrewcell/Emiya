const resize = function() {
    const card = $('.card');
    if (screen.width < 800 || $(window).width() < 800) {
        card.removeClass('col-2');
        card.addClass('col-4');
    } else {
        card.removeClass('col-4');
        card.addClass('col-2');
    }
}

$(function() {
    resize();
    $(window).resize(function() { resize() })
});

$('.form-control').keyup(function() {
    $('.card').show();
    const filter = $(this).val();
    $('.row').find('.card .card-body div:not(:contains(\''+filter+'\'))').parent().parent('.card').css('display', 'none')
});
