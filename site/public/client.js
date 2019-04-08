$(function () {

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
        $(this).text(length);
        var isValidTime = /^\d\d:([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(length);
        if (name != "" & isValidTime) {
            $(this).parents(".song-section").find(".song-list ul").append("<li class=\"row\">" + name + "</li>");
        }
        else {
            $(this).parents(".jumbotron").find(".invalid-song").prop("hidden", false);
        }
    });
});