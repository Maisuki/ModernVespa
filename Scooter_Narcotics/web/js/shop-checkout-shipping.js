var carrier = "";
var serviceChosen = "";
var subTotal;
var shippingCost;

$(document).ready(function () {
    $(".stripePanel").hide();
    $(".WTPayment").hide();
    $(".paypalPanel").hide();
    if (ccode !== "SGD") {
        document.getElementById("hideService").style.display = 'none';
    }
    $("#totalPrice").text(ccode + " " + cartPrice);
    subTotal = cartPrice;
});

/**** SHIPPING METHOD ****/
$('.shippingmethod').change(function () {
    carrier = $(this).val();
    var service;
    $("#shippingServices").empty();
    if (carrier === "UPS") {
        service = ups;
        var data = ($.parseJSON(service));
        var info = "";
        for (var i = 0; i < data.UPS.length; i++) {
            info += "<label class='radio'>";
            info += "<input onchange='serviceSelected(this)' type='radio' name='service' value='" + data.UPS[i].rate.toFixed(2) + "-" + data.UPS[i].service + "' />";
            info += "<i></i>";
            info += data.UPS[i].service + " - " + ccode + data.UPS[i].rate.toFixed(2);
            info += "</label>";
            info += "<br/><br/>";
        }
        $("#shippingServices").html(info);
    } else if (carrier === "FEDEX") {
        /*service = fedex;
         var data = ($.parseJSON(service));
         for(var i = 0 ; i <data.FEDEX.length; i++){
         var info = "<label class='radio'>";
         info += "<input onchange='serviceSelected(this)' type='radio' name='service' value='" + data.FEDEX[i].rate + "-" + data.FEDEX[i].service + "' />";
         info += "<i></i>";
         info += data.FEDEX[i].service + " - " + ccode + data.FEDEX[i].rate.toFixed(2);
         info += "</label>";
         $("#shippingServices").html(info);
         }*/
        var info = "<label>Coming soon! </label>"
        $("#shippingServices").html(info);
        $("#fee").text("-");
        $("#totalPrice").text(ccode + " " + cartPrice);

    } else if (carrier === "DHL") {
        /*service = dhl;
         var data = ($.parseJSON(service));
         for(var i = 0 ; i <data.DHL.length; i++){
         var info = "<label class='radio'>";
         info += "<input onchange='serviceSelected(this)' type='radio' name='service' value='" + data.DHL[i].rate + "-" + data.DHL[i].service + "' />";
         info += "<i></i>";
         info += data.DHL[i].service + " - " + ccode + data.DHL[i].rate.toFixed(2);
         info += "</label>";
         $("#shippingServices").html(info);
         }*/
        var info = "<label>Coming soon! </label>"
        $("#shippingServices").html(info);
        $("#fee").text("-");
        $("#totalPrice").text(ccode + " " + cartPrice);
    }
});

function serviceSelected(obj) {
    var str = obj.value;
    var res = str.split("-");

    serviceChosen = res[1];
    shippingCost = res[0];
    subTotal = cartPrice;
    $("#fee").text(ccode + " " + shippingCost);

    $("#totalPrice").text(ccode + " " + (parseFloat(shippingCost) + parseFloat(subTotal)).toFixed(2));
}
/**** SHIPPING METHOD ****/


/**** PAYMENT METHOD ****/
$('.paymentmethod').change(function () {
    var fee = $("#fee");
    if (fee.text() === "-") {
        $.toast({
            heading: 'Error',
            text: "Please select your carrier !",
            showHideTransition: 'fade',
            icon: 'error'
        });
        $(this).prop("checked", false);
        return;
    }

    var method = $(this).val();
    if (method === "Credit") {
        $(".WTPayment").hide();
        $(".paypalPanel").hide();
        $(".stripePanel").show();
    } else if (method === "Paypal") {
        $(".WTPayment").hide();
        $(".paypalPanel").show();
        $(".stripePanel").hide();
    } else {
        $(".WTPayment").show();
        $(".paypalPanel").hide();
        $(".stripePanel").hide();
    }

    $('.paymentmethod').each(function () {
        if ($(this).val() === method && !$(this).prop("checked")) {
            $(this).prop("checked", true);
        }
    });
});
/**** PAYMENT METHOD ****/

/**** PLACE ORDER ****/
$(".WTplaceOrder").click(function () {
    processPayment("-", "Wire Transfer", "Order submitted, oder will be process after payment is received");
});
/**** PLACE ORDER ****/

/**** PAYMENT TYPE: PAYPAL (DESKTOP) ****/
paypal.Button.render({
    env: 'production', // Or 'sandbox',
    //env: 'sandbox',
    client: {
        //sandbox: 'AZsWwdGCW4gn7Hl5Amo9M5ibbJ554ekemdbZ_eboDusCfTJEPl82fOgGHIB1LktSnq18DKcXDuUEAM2j'
        production: 'ARXZ5Lb4rDqoStBJMKqoTgVQUbgvQ1PWCHen3yIMScxWxNKY_C2F2KBkfNvPaXK6_1alKzSpI4QQXVMu'
    },
    commit: true, // Show a 'Pay Now' button
    style: {
        color: 'gold',
        size: 'medium'
    },
    payment: function (data, actions) {
        return actions.payment.create({
            payment: {
                transactions: [{
                        amount: {total: (parseFloat(shippingCost) + parseFloat(subTotal)).toFixed(2), currency: ccode}
                    }]
            }
        });
    },
    onAuthorize: function (data, actions) {
        return actions.payment.execute().then(function (payment) {
            // The payment is complete!
            processPayment(payment.id, "PayPal", "Payment Successful");
        });
    }
}, '#paypal-button');
/**** PAYMENT TYPE: PAYPAL (DESKTOP) ****/

/**** PAYMENT TYPE: PAYPAL (MOBILE) ****/
paypal.Button.render({
    env: 'production', // Or 'sandbox',
    //env: 'sandbox',
    client: {
        //sandbox: 'AZsWwdGCW4gn7Hl5Amo9M5ibbJ554ekemdbZ_eboDusCfTJEPl82fOgGHIB1LktSnq18DKcXDuUEAM2j'
        production: 'ARXZ5Lb4rDqoStBJMKqoTgVQUbgvQ1PWCHen3yIMScxWxNKY_C2F2KBkfNvPaXK6_1alKzSpI4QQXVMu'
    },
    commit: true, // Show a 'Pay Now' button
    style: {
        color: 'gold',
        size: 'medium'
    },
    payment: function (data, actions) {
        return actions.payment.create({
            payment: {
                transactions: [{
                        amount: {total: (parseFloat(shippingCost) + parseFloat(subTotal)).toFixed(2), currency: ccode}
                    }]
            }
        });
    },
    onAuthorize: function (data, actions) {
        return actions.payment.execute().then(function (payment) {
            // The payment is complete!
            processPayment(payment.id, "PayPal", "Payment Successful");
        });
    }
}, '#paypal-button1');
/**** PAYMENT TYPE: PAYPAL (MOBILE) ****/

/**** PAYMENT TYPE: STRIPE (DESKTOP) ****/
var stripeDesktop = Stripe(stripeKey);
var elementsDesktop = stripeDesktop.elements();

var cardDesktop = elementsDesktop.create('card', {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#8898AA',
            color: 'white',
            lineHeight: '36px',
            fontWeight: 300,
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '19px',

            '::placeholder': {
                color: '#8898AA',
            },
        },
        invalid: {
            iconColor: '#e85746',
            color: '#e85746',
        }
    },
    classes: {
        focus: 'is-focused',
        empty: 'is-empty',
    },
});
cardDesktop.mount('#card-element');

var inputsDesktop = document.querySelectorAll('input.field');
Array.prototype.forEach.call(inputsDesktop, function (input) {
    input.addEventListener('focus', function () {
        input.classList.add('is-focused');
    });
    input.addEventListener('blur', function () {
        input.classList.remove('is-focused');
    });
    input.addEventListener('keyup', function () {
        if (input.value.length === 0) {
            input.classList.add('is-empty');
        } else {
            input.classList.remove('is-empty');
        }
    });
});

function setOutcomeDesktop(result) {
    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');
    var errorMsg = document.getElementById('errorMsg');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');
    errorMsg.classList.remove('visible');

    if (result.token) {
        processPayment(result.token.id, "stripe", "Payment successful");
    } else if (result.error) {
        errorElement.textContent = result.error.message;
        errorElement.classList.add('visible');
    }
}

cardDesktop.on('change', function (event) {
    setOutcomeDesktop(event);
});

document.querySelector('.form').addEventListener('submit', function (e) {
    $("button[type=submit]").attr("disabled", "disabled");
    e.preventDefault();
    var form = document.querySelector('.form');
    var extraDetails = {
        name: form.querySelector('input[name=cardholder-name]').value,
    };
    stripeDesktop.createToken(cardDesktop, extraDetails).then(setOutcomeDesktop);
});
/**** PAYMENT TYPE: STRIPE (DESKTOP) ****/

/**** PAYMENT TYPE: STRIPE (MOBILE) ****/
var stripeMobile = Stripe(stripeKey);
var elementsMobile = stripeMobile.elements();

var cardMobile = elementsMobile.create('card', {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#8898AA',
            color: 'white',
            lineHeight: '36px',
            fontWeight: 300,
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '19px',

            '::placeholder': {
                color: '#8898AA',
            },
        },
        invalid: {
            iconColor: '#e85746',
            color: '#e85746',
        }
    },
    classes: {
        focus: 'is-focused',
        empty: 'is-empty',
    },
});
cardMobile.mount('#card-element1');

var inputsMobile = document.querySelectorAll('input.field1');
Array.prototype.forEach.call(inputsMobile, function (input) {
    input.addEventListener('focus', function () {
        input.classList.add('is-focused');
    });
    input.addEventListener('blur', function () {
        input.classList.remove('is-focused');
    });
    input.addEventListener('keyup', function () {
        if (input.value.length === 0) {
            input.classList.add('is-empty');
        } else {
            input.classList.remove('is-empty');
        }
    });
});

function setOutcomeMobile(result) {
    var successElement = document.querySelector('.success1');
    var errorElement = document.querySelector('.error1');
    var errorMsg = document.getElementById('errorMsg1');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');
    errorMsg.classList.remove('visible');

    if (result.token) {
        processPayment(result.token.id, "stripe", "Payment successful");
    } else if (result.error) {
        errorElement.textContent = result.error.message;
        errorElement.classList.add('visible');
    }
}

cardMobile.on('change', function (event) {
    setOutcomeMobile(event);
});

document.querySelector('.form1').addEventListener('submit', function (e) {
    $("button[type=submit]").attr("disabled", "disabled");
    e.preventDefault();
    var form = document.querySelector('.form1');
    var extraDetails = {
        name: form.querySelector('input[name=cardholder-name1]').value,
    };
    stripeMobile.createToken(cardMobile, extraDetails).then(setOutcomeMobile);
});
/**** PAYMENT TYPE: STRIPE (MOBILE) ****/

/**** PROCESS PAYMENT ****/
function processPayment(id, type, msg) {
    $('#paymentDetails').loading({
        stoppable: false,
        message: 'Processing...',
        theme: 'dark'
    });
    $.ajax({
        type: 'POST',
        url: 'processPayment',
        data: {
            transactionId: id,
            total: $('#totalPrice')[0].innerHTML,
            curr: ccode,
            carrier: carrier,
            service: serviceChosen,
            paymentType: type,
            shipcost: shippingCost
        },
        success: function (data) {},
        complete: function (e, xhr, settings) {
            var rawData = e.responseText;
            if (rawData === "Unauthorized access!") {
                $.toast({
                    heading: 'Error',
                    text: rawData,
                    showHideTransition: 'fade',
                    icon: 'error'
                });
                return;
            }

            var data = ($.parseJSON(e.responseText));
            if (e.status === 200 && data.status) {
                $('#paymentDetails').loading('stop');

                $.toast({
                    heading: 'Success',
                    text: msg,
                    showHideTransition: 'slide',
                    icon: 'success'
                });
                window.location.href = "thankyou.jsp";
            } else {
                if (data.message === "You must login to make payment!") {
                    location.replace("login.jsp?page=shop-checkout-shipping.jsp&message=Session%20Expired%21%20Please%20relogin%21");
                } else {
                    $.toast({
                        heading: 'Error',
                        text: data.message,
                        showHideTransition: 'fade',
                        icon: 'error'
                    });
                }
            }
        },
        dataType: 'json'
    });
}
/**** PROCESS PAYMENT ****/