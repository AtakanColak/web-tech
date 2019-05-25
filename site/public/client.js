$(function () {

    // var wh = $(window).height();
    // var mh = $("main").height();
    // var bm = $("main").offset().top + mh;
    // if (bm < wh) {
    //     var bh = $("body").height();
    //     var hh = $("header").height();
    //     var fh = bh - (hh + mh);
    //     $("footer").height(fh);
    //     var footerbottom = $("footer").offset().top + $("footer").height();
    //     var subfootertop = footerbottom - $(".subfooter").height();
    //     // $("footer").css({position: 'relative'});
    //     $(".subfooter").css({ top: subfootertop, position: 'absolute' });
    // }


    var socket = io();

    $(window).resize(function () {
        var wh = $(window).height();
        var mh = $("main").height();
        var bm = $("main").offset().top + mh;
        if (bm < wh) {
            var bh = $("body").height();
            var hh = $("header").height();
            var fh = bh - (hh + mh);
            $("footer").height(fh);
            var footerbottom = $("footer").offset().top + $("footer").height();
            var subfootertop = footerbottom - $(".subfooter").height();
            // $("footer").css({position: 'relative'});
            $(".subfooter").css({ top: subfootertop, position: 'absolute' });
        }

    });

    $(window).resize();

    $(window).mousedown(function () {
        $(window).resize();
    });
    // alert("Blocker cookie is " + Cookies.get("b"));
    if (Cookies.get("b") != "true") {
        var targeted_popup_class = $('[data-popup-open]').attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
    }



    //----- CLOSE
    $('[data-popup-close]').on('click', function (e) {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        Cookies.set("b", "true")
        e.preventDefault();
    });


    $("img.star").on('click', function (e) {
        var i = $(this).index();
        $(this).attr("src", "images/star-checked.svg");
        $(this).parents(".starbuttons span").prevAll().find("img.star").attr("src", "images/star-checked.svg");
        $(this).parents(".starbuttons span").nextAll().find("img.star").attr("src", "images/star.svg");
        var score = 7 - $(this).parents(".starbuttons span").nextAll().length;
        Cookies.set("commentscore", score);
    });

    $(".dropdown-menu a").click(function () {
        $(this).parents(".form-group").find(".dropdown-toggle").text($(this).text());
        $(this).parents(".form-group").find(".dropdown-toggle").val($(this).index());
    });

    $('input[type="file"]').change(function (e) {
        var fileName = e.target.files[0].name;
        $('.custom-file-label').html(fileName);
    });

    $('input[type="checkbox"]').change(function (e) {
        var check = $(this).prop("checked");
        $(this).val(check);
    });

    $(".add-song").click(function (e) {
        e.preventDefault();
        var name = $(this).parents(".jumbotron").find("#input_song_name").val();
        var length = $(this).parents(".jumbotron").find("#input_song_length").val();
        var path = $(this).parents(".jumbotron").find("#input_track_path").val();
        var index = $(this).parents(".jumbotron").find("#input_song_number").val();
        var isValidTime = /^\d\d:([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(length);
        if (name != "" && isValidTime && path != "" && index > 0) {
            $(this).parents(".song-section").find(".song-list ul").append("<li class=\"row\"><h5 class=\"col-md-2 text-center\">" + index + ".</h5><h5 class=\"col-md-6 text-center\">" + name + "</h5><h5 class=\"col-md-2 text-center\">" + length + "</h5></li>");
        }
        else {
            $(this).parents(".jumbotron").find(".invalid-song").prop("hidden", false);
        }
    });

    $("#loginbutton").click(function (e) {
        var u = $(this).parents("#loginform").find("#input_username").val();
        var p = $(this).parents("#loginform").find("#input_user_password").val();
        Cookies.set("username", u);
        Cookies.set("password", p);
    });

    $("#registerbutton").click(function (e) {
        var u = $(this).parents("#registerform").find("#input_username").val();
        var em = $(this).parents("#registerform").find("#input_email").val();
        var p = $(this).parents("#registerform").find("#input_user_password").val();
        Cookies.set("username", u);
        Cookies.set("email", em);
        Cookies.set("password", p);
    });

    $(document).ready(function () {
        if (Cookies.get("user") == "false") {
            $("#loggedin").hide();
            $("#notloggedin").show();
            $("#cli").hide();
            $("#clo").show();
        }
        else {
            $("#clo").hide();
            $("#cli").show();
            $("#notloggedin").hide();
            $("#loggedin").show();
            if (Cookies.get("user") == "admin") {
                $("#editrel").show();
            }
            else {
                $("#editrel").hide();
            }
        }
    });
});

