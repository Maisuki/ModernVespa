<script language="Javascript">
    var ccode = "<%=geoplugin_currencyCode%>";
    //var ccode="EUR";
    if (ccode === "VND" || ccode === "TWD") {
        ccode = "USD";
    }
    document.write(ccode);
</script>