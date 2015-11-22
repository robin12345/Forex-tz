$(function(){
    var model = new FormModel();
    var view = new FormView({
        model: model,
        el: '.inner'
    });
});

$(function() {
    $( "#slider" ).slider({
        range: "min",
        value: 20,
        min: 1,
        max: 40,
        slide: function( event, ui ) {
            $( "#multi" ).val( ui.value );
        }
    });
    $("#multi" ).val( $( "#slider" ).slider( "value" ) );
    $(".slider_wrap").mouseup(function(){
        $('.slider_wrap').css('display','none');
    });
    $("#multi").click(function(){
        $('.slider_wrap').css('display','block');
    });

});
