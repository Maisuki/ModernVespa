<script>
    function resizeAction() {
        var md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null && md.tablet() === null) {
            $(".nonMobileDisplayOption").css("display", "none");
            $(".mobileDisplayOption").css("display", "block");
            
            // Services page only
            $(".sDesktopDisplayOption").css("display", "none");
            $(".sMobileDisplayOption").css("display", "block");
            $(".sTabletDisplayOption").css("display", "none");
            
            $(".specialDisplay").css("display", "inline-block");
            $(".specialAdjustment").css("margin-left", "");
            
            $("#nav-items").css("overflow", "scroll");
            $("#nav-items").css("height", "520px");
        }
        // Tablet
        else if (md.mobile() !== null && md.tablet() !== null) {
            $(".nonMobileDisplayOption").css("display", "block");
            $(".mobileDisplayOption").css("display", "none");
            
            // Services page only
            $(".sDesktopDisplayOption").css("display", "none");
            $(".sMobileDisplayOption").css("display", "none");
            $(".sTabletDisplayOption").css("display", "block");
            var width = $( window ).width();
            var marginLeft = width / 2 * 1.45;
            $(".sTabletFilterWidth").css("margin-left", marginLeft);
            
            marginLeft = width / 3.2;
            $(".thankyoumargin").css("margin-left", marginLeft);
            $(".specialDisplay").css("display", "none");
            $(".specialAdjustment").css("margin-left", "25%");
            
            $("#nav-items").css("overflow", "");
            $("#nav-items").css("height", "");
        }
        else {
            $(".nonMobileDisplayOption").css("display", "block");
            $(".mobileDisplayOption").css("display", "none");
            
            // Services page only
            $(".sDesktopDisplayOption").css("display", "block");
            $(".sMobileDisplayOption").css("display", "none");
            $(".sTabletDisplayOption").css("display", "none");
            
            var width = $( window ).width();
            var marginLeft = width / 2.8;
            $(".thankyoumargin").css("margin-left", marginLeft);
            $(".specialDisplay").css("display", "none");
            
            $("#nav-items").css("overflow", "");
            $("#nav-items").css("height", "");
        }
    }
    
    $(window).resize(function() {
        resizeAction();
    }).resize()
</script>
<!-- scripts -->