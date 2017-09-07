var Validate = {
    SetCorrect: function (id) {
        $("#" + id).removeClass('i_text_error');
        $("#" + id + "Corrent").addClass('i_correct');
        $("#" + id + "Tip").removeClass('f_explain').text('');
    },
    SetError: function (id, msg) {
        $("#" + id + "Corrent").removeClass('i_correct');
        $("#" + id).addClass('i_text_error');
        $("#" + id + "Tip").addClass('f_explain').html(msg);
    }
}
var CrossHost = [
'http://localhost:26522',
'http://www.rutisher.com',
'http://www.baoyeah.com',
'http://www.monteamor.com',
'http://www.korirl.com',
'http://www.ing2ing.com',
'http://www.alaves.com',
'http://www.suorang.com',
'http://www.0-100s.com',
'http://www.qjherb.com',
'http://www.alaves.cn',
'http://www.cherriespie.com',
'http://www.vplaza.cn'
];