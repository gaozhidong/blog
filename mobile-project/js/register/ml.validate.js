var ML = {
    Validator: {
        IsEmail: function (val) {
            return /^[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]*)*@[a-zA-Z0-9\-]+([\.][a-zA-Z0-9\-]+)+$/i.test(val);
        },
        IsMobile: function (val) {
            return /^1[3,4,5,8][0-9]{9,9}$/i.test(val);
        },
        IsTelphone: function (val) {
            return /(^(\d{3,4})-(\d{7,8})$)|(^(\d{3,4})-(\d{7,8})-(\d{1,4})$)/i.test(val);
        },
        IsDate: function (val) {
            return !/Invalid|NaN/.test(new Date(val));
        },
        IsEmptyOrNull: function (val) {
            val = $.trim(val);
            if (val == "" || val == null || val == undefined) {
                return false;
            } else {
                return true;
            }
        }
    },
    ValidatorStyle: {
        Error: function (obj, msg) {
            $("#" + obj).removeClass();
            $("#" + obj).text(msg);
            $("#" + obj).addClass("validateerror");
        },
        Success: function (obj) {
            $("#" + obj).removeClass();
            $("#" + obj).html("&nbsp;");
            $("#" + obj).addClass("validatesuccess");
        }
    }
}