<div class="grid-col-12">
    <!-- catalog toolbar -->
    <div class="nonMobileDisplayOption block-catalog-toolbar clear-nofix" style="margin-top: 10px;">
        <div class="view">
            <h6>Choose your vehicle:</h6> 
            &nbsp;
        </div>
        <div class="select">
            <select id="brand">
                <jsp:include page="bikeBrand.jsp"></jsp:include>
            </select>
        </div>
        <div class="select">
            <select id="models">
                <option value="">Select Model</option>
            </select>
        </div>
        <div class="select">
            <select id="selectCat">
                <jsp:include page="categories.jsp"></jsp:include>
            </select>
        </div>
        <div>
            <a style="margin-top: 9px" id="tocart" onclick='searchItem()' class="button">Search</a>
        </div>
    </div>
</div>