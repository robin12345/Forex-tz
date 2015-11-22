var FormView = Backbone.View.extend({

    events: {

        "blur #sum": "editSum",
        "blur #multi": "editSum",
        "mouseup .slider_wrap": "editSum",

        "click .wrapper": "toggleMiddle",

        "click #dollar": "editType",
        "click #percent": "editType",

        "click #profit": "editAimProfit",
        "click #loss": "editAimLoss",

        "blur .loss_input": "editLoss",
        "blur .profit_input": "editProfit",

        "click #growth": "sendAjaxGr",
        "click #reduction": "sendAjaxRe",

        "click .btn-loss-u": "changeLossU",
        "click .btn-loss-d": "changeLossD",
        "click .btn-profit-u": "changeProfitU",
        "click .btn-profit-d": "changeProfitD"
    },

    initialize: function() {
        this.template = _.template($("#viewForm").html());
        //this.listenTo(this.model,"change", this.render);
        this.render();
    },

    render: function() {
        var json = this.model.toJSON();
        var view = this.template(json);
        this.$el.html(view);
    },

    toggleMiddle: function() {

        var wrap = $('.wrapper');
        var conf = $('.confines');

        wrap.toggleClass('open');
        conf.toggleClass('open');
    },

    editType: function(e){
        var type = $(".icon-type");
        if(this.$(e.target).attr('id') == 'dollar'){
            this.model.set({confines: '$'});
            type.removeClass('icon-percent');
            type.addClass('icon-dollar');

        } else if (this.$(e.target).attr('id') == 'percent') {
            this.model.set({confines: '%'});
            type.removeClass('icon-dollar');
            type.addClass('icon-percent');
        }
    },

    editLoss: function(){
        var val = parseInt(this.$('.loss_input').val());
        var vah = parseInt(this.$('.profit_input').val());
        var sum = parseInt(this.$('#sum').val());
        var multi = parseInt(this.$('#multi').val());
        var req = this.model.set({takeProfit: vah},{validate: true});
        if (req !== false){
            this.model.set({stopLoss: val, sumInv: sum, mult: multi},{validate: true});
        }
    },

    editProfit: function(){
        var val = parseInt(this.$('.profit_input').val());
        var sum = parseInt(this.$('#sum').val());
        var vah = parseInt(this.$('.loss_input').val());
        var multi = parseInt(this.$('#multi').val());
        var req = this.model.set({stopLoss: vah},{validate: true});
        if (req !== false){
            this.model.set({takeProfit: val, sumInv: sum, mult: multi},{validate: true});
        }
    },

    editAimLoss: function(){
        var loss = $('#loss');
        var wrap_loss = $('.wrap.loss');
        var loss_inp = $('.wrap.loss input[type=text]');
        var percent = this.model.get('sumInv');
        percent = Math.ceil(percent*0.3);

        if(loss.is(':checked')){
            wrap_loss.removeClass('close');
            loss_inp.removeAttr('readonly');
            loss_inp.attr('value',percent);
            this.model.set({stopLoss: percent}, {validate: true});
        } else if (!(loss.is(':checked'))) {
            wrap_loss.addClass('close');
            loss_inp.attr('readonly','readonly');
            loss_inp.attr('value','');
            $('.loss_e.error').css('display','none');
            this.model.unset('stopLoss');
        }
    },

    editAimProfit: function(){
        var profit = $('#profit');
        var wrap_profit = $('.wrap.profit');
        var profit_inp = $('.wrap.profit input[type=text]');
        var percent = this.model.get('sumInv');
        percent = Math.ceil(percent*0.3);

        if(profit.is(':checked')){
            wrap_profit.removeClass('close');
            profit_inp.removeAttr('readonly');
            profit_inp.attr('value',percent);
            this.model.set({takeProfit: percent}, {validate: true});
        } else if (!(profit.is(':checked'))) {
            wrap_profit.addClass('close');
            profit_inp.attr('readonly','readonly');
            profit_inp.attr('value','');
            $('.profit_e.error').css('display','none');
            this.model.unset('takeProfit');
        }

    },

    editSum: function() {
        var val = parseInt(this.$('input#sum').val());
        var multi = parseInt(this.$('input#multi').val());
        var loss = $('#loss');
        var profit = $('#profit');
        var paramLoss, paramProf;


        if (val > 200000){
            this.$('input#sum').attr('value', 200000);
            val = 200000;
        }

        var total = multi*val;

        var percent = Math.ceil(val*0.3);

        var loss_inp = $('.wrap.loss input[type=text]');
        var profit_inp = $('.wrap.profit input[type=text]');

        if(loss.is(':checked')){
            loss_inp.attr('value',percent);
            paramLoss = percent;
        }

        if(profit.is(':checked')){
            profit_inp.attr('value',percent);
            paramProf = percent;
        }

        var res = this.model.set({
            sumInv: val,
            mult: multi,
            total_sum: total,
            stopLoss: paramLoss,
            takeProfit: paramProf
        },{
            validate: true
        });

        if(res !== false){
            $('.total_sum').html(total);
        }

    },

    changeLossU: function() {
        if ($('#loss').is(':checked')) {
            var size = parseInt(this.model.get('stopLoss'));

            size = size + 1;

            var res = this.model.set({
                stopLoss: size
            },{
                validate: true
            });

            if (res !== false){
                $('.loss_input').val(size);
            }
        }
    },

    changeLossD: function() {
        if ($('#loss').is(':checked')) {
            var size = parseInt(this.model.get('stopLoss'));

            size = size - 1;

            var res = this.model.set({
                stopLoss: size
            },{
                validate: true
            });

            if (res !== false){
                $('.loss_input').val(size);
            }
        }
    },

    changeProfitU: function() {
        if ($('#profit').is(':checked')) {
            var size = parseInt(this.model.get('takeProfit'));

            size = size + 1;

            var res = this.model.set({
                takeProfit: size
            },{
                validate: true
            });

            if (res !== false){
                $('.profit_input').val(size);
            }
        }
    },

    changeProfitD: function() {
        if ($('#profit').is(':checked')) {
            var size = parseInt(this.model.get('takeProfit'));

            size = size - 1;

            var res = this.model.set({
                takeProfit: size
            },{
                validate: true
            });

            if (res !== false){
                $('.profit_input').val(size);
            }
        }
    },

    sendAjaxGr: function(){

        if ($('.btn').attr('data-type') == 'open') {
            var val = 'growth';
            this.model.set({direction: val});

            var json = this.model.toJSON();
            console.log(json);

            //$.ajax({
            //    url: "",
            //    type: "post",
            //    data: (json),
            //    dataType: "html",
            //    beforeSend: Before,
            //    success: Success
            //});

            alert('Данные отправлены (Console)');
        }
    },

    sendAjaxRe: function(){
        if ($('.btn').attr('data-type') == 'open') {
            var val = 'reduction';
            this.model.set({direction: val});

            var json = this.model.toJSON();
            console.log(json);

            //$.ajax({
            //    url: "",
            //    type: "post",
            //    data: json,
            //    dataType: "html",
            //    beforeSend: Before,
            //    success: Success
            //});

            alert('Данные отправлены (Console)');
        }
    }

});