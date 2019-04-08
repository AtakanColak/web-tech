$(function(){

    $(".dropdown-menu a").click(function(){
        // $(this).parents(".form-group").hide();
    $(this).parents(".form-group").find(".dropdown-toggle").text($(this).text());
    $(this).parents(".form-group").find(".dropdown-toggle").val($(this).index());
   });

});