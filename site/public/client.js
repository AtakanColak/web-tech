$(function () {

    $(".dropdown-menu a").click(function () {
        $(this).parents(".form-group").find(".dropdown-toggle").text($(this).text());
        $(this).parents(".form-group").find(".dropdown-toggle").val($(this).index());
    });

    $('input[type="file"]').change(function (e) {
        var fileName = e.target.files[0].name;
        $('.custom-file-label').html(fileName);
    });

    $('input[type="checkbox"]').change(function(e) {
        if ($(this).attr("checked") == "1") {
            $(this).attr("checked", 0);
        }
        else if ($(this).attr("checked") == "0") {
            $(this).attr("checked", 1);
        }
        // $(this).attr("checked", !$(this).attr("checked")); 
        // $(this).parents("label").val($(this).prop("checked"));
    });
});