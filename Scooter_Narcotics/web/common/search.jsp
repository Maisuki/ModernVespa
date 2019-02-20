<!-- search -->
<div class="grid-col-search grid-col-custom">
    <div class="widget-search">
        <input style="color: #111" id="searchBar"type="text" placeholder="Search for parts, brands or products" onkeypress="return runScript(event)">

        <button class="fa fa-search" onclick='search()'></button>
    </div>
</div>
<!--/ search -->
<script>
    function search() {
        window.location.href = "products.jsp?search=" + $('#searchBar').val();
    }
    function runScript(e) {
        //See notes about 'which' and 'key'
        if (e.keyCode == 13) {
            search();
        }
    }
</script>