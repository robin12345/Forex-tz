var FormModel = Backbone.Model.extend({
    defaults: {
        sumInv: 5000,
        mult: 40,
        confines: '$',
        total_sum: '200 000'
    },

    validate: function(attrs) {
        var btn = $('.btn');
        var sum_r = $('.sum_e.error');
        if (attrs.sumInv >= 100) {
            sum_r.css('display','none');
            btn.attr('data-type','open');
            $('#sum').css('border', '1px solid #c0c2c4');
        } else {
            sum_r.css('display','block');
            btn.attr('data-type','close');
            $('#sum').css('border', '1px solid #E64545');
            return 'incorrect sum';
        }

        var multi_r = $('.multi_e.error');
        if ((attrs.mult <= 40) && ( attrs.mult >= 1)) {
            multi_r.css('display','none');
            btn.attr('data-type','open');
        } else {
            multi_r.css('display','block');
            multi_r.html('Неверное значение мультипликатора');
            btn.attr('data-type','close');
            return 'incorrect sum';
        }

        var min = Math.ceil((attrs.sumInv)*0.1);
        var max = attrs.sumInv;

        if (($('#profit').is(':checked'))) {
            var profit_r = $('.profit_e.error');
            if (attrs.takeProfit >= min) {
                profit_r.css('display', 'none');
                btn.attr('data-type','open');
            } else if (attrs.takeProfit < min) {
                if (attrs.confines == '$') {
                    profit_r.css('display', 'block');
                    profit_r.html('Не может быть меньше $ ' + min);
                    btn.attr('data-type','close');
                    return 'incorrect';
                } else if (attrs.confines == '%') {
                    profit_r.css('display', 'block');
                    profit_r.html('Не может быть меньше 10%');
                    btn.attr('data-type','close');
                    return 'incorrect';
                }
            }
        }

        if (($('#loss').is(':checked'))){
            var loss_r = $('.loss_e.error');
            if ((attrs.stopLoss >= min) && (attrs.stopLoss <= max)){
                loss_r.css('display','none');
                btn.attr('data-type','open');
            } else if (attrs.stopLoss > max){
                if (attrs.confines == '$') {
                    loss_r.css('display', 'block');
                    loss_r.html('Не может быть больше $ ' + max);
                    btn.attr('data-type','close');
                    return 'incorrect';
                } else if (attrs.confines == '%') {
                    loss_r.css('display', 'block');
                    loss_r.html('Не может быть больше 100%');
                    btn.attr('data-type','close');
                    return 'incorrect';
                }
            } else if (attrs.stopLoss < min){
                if (attrs.confines == '$') {
                    loss_r.css('display', 'block');
                    loss_r.html('Не может быть меньше $ ' + min);
                    btn.attr('data-type','close');
                    return 'incorrect';
                } else if (attrs.confines == '%') {
                    loss_r.css('display', 'block');
                    loss_r.html('Не может быть меньше 10%');
                    btn.attr('data-type','close');
                    return 'incorrect';
                }
            }
        }
    }
});