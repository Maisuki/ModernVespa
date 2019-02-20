$(document).ready(function () {
    if (ccode !== "SGD") {
        $("#hideService").hide();
    }
    if (userObject !== "") {
        $("#bFname").val(userObject["fname"]);
        $("#bLname").val(userObject["lname"]);
        $("#bPhone").val(userObject["contact"]);
        var billAddress = userObject["billAddress"];
        $("#bAdd").val(billAddress["street"]);
        $("#bCity").val(billAddress["city"]);
        $("#country").val(billAddress["country"]);
        $("#bState").val(billAddress["state"]);
        $("#bZip").val(billAddress["zip"]);
    }
});

function yesnoCheck() {
    if (document.getElementById('yesCheck').checked) {
        document.getElementById('ifYes').style.visibility = 'visible';
    } else {
        document.getElementById('ifYes').style.visibility = 'hidden';
    }
}

function triggerChange() {
    $("#sameAdd").trigger("change");
}

$("#sameAdd").change(function () {
    var checked = document.getElementById("sameAdd").checked;
    var bFname = $("#bFname").val();
    var bLname = $("#bLname").val();
    var bCname = $("#bCname").val();
    var bAdd = $("#bAdd").val();
    var bCity = $("#bCity").val();
    var bState = $("#bState").val();
    var bZip = $("#bZip").val();
    var bPhone = $("#bPhone").val();
    var bCountry = $('select#country option:selected').val();

    if (checked) {
        $("#fname").val(bFname);
        $("#add").val(bAdd);
        $("#city").val(bCity);
        $("#state").val(bState);
        $("#zip").val(bZip);
        $("#phone").val(bPhone);
        $("#lname").val(bLname);
        $("#cname").val(bCname);
        $("#sCountry").val(bCountry);
    } else {
        $("#fname").val("");
        $("#add").val("");
        $("#city").val("");
        $("#state").val("");
        $("#zip").val("");
        $("#phone").val("");
        $("#lname").val("");
        $("#cname").val("");
        $("#sCountry").val("0");
    }
});

triggerChange();

function proceed() {
    var name = $("#fname").val() + " " + $("#lname").val();
    var add = $("#add").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var zip = $("#zip").val();
    var phone = $("#phone").val();
    var country = $('select#sCountry option:selected').val();
    if (name === undefined || name.trim().length === 0 ||
            add === undefined || add.trim().length === 0 ||
            city === undefined || city.trim().length === 0 ||
            state === undefined || state.trim().length === 0 ||
            zip === undefined || zip.trim().length === 0 ||
            phone === undefined || phone.trim().length === 0) {
        $.toast({
            heading: 'Error',
            text: "Please fill in all fields",
            showHideTransition: 'fade',
            icon: 'error'
        });
    } else {
        $('#shipDetails').loading({
            stoppable: false,
            message: 'Processing...',
            theme: 'dark'
        });
        $.ajax({
            type: 'POST',
            url: 'ship',
            data: {
                toName: name,
                toAdd1: add,
                toAdd2: " ",
                toState: state,
                toCity: city,
                toPostal: zip,
                toContact: phone,
                toCountry: country,
                ccode: ccode
            },
            success: function (data) {},
            complete: function (e, xhr, settings) {
                var rawData = e.responseText;
                console.log(rawData);
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
                    window.location.href = "shop-checkout-shipping.jsp";
                }
                else {
                    if (data.message === "You must login to proceed with your checkout process!") {
                        location.replace("login.jsp?page=shop-checkout-particulars.jsp&message=Session%20Expired%21%20Please%20relogin%21");
                    }
                    else {
                        $.toast({
                            heading: 'Error',
                            text: data.message,
                            showHideTransition: 'fade',
                            icon: 'error'
                        });
                    }
                }
                $('#shipDetails').loading('stop');
            },
            dataType: 'json'
        });
    }
}