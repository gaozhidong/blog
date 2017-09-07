var VPWD = {
    Check: function (newpwd) {
        var pattern_1 = /^.*([\W_])+.*$/i;
        var pattern_2 = /^.*([a-zA-Z])+.*$/i;
        var pattern_3 = /^.*([0-9])+.*$/i;
        var strength = 0;
        if (newpwd.length > 10) {
            strength++;
        }
        if (pattern_1.test(newpwd)) {
            strength++;
        }
        if (pattern_2.test(newpwd)) {
            strength++;
        }
        if (pattern_3.test(newpwd)) {
            strength++;
        }
        if (strength <= 1) {
            $("#strength").removeClass().addClass("ir icon-s-01");
            return 1;
        }
        else if (strength == 2) {
            $("#strength").removeClass().addClass("ir icon-s-02");
            return 2;
        }
        else {
            $("#strength").removeClass().addClass("ir icon-s-03");
            return 3;
        }
    }
}