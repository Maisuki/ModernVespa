<div class="block-catalog-toolbar clear-nofix" style="margin-bottom: 30px;">
    <div class="view mobileDisplayOption" align="center">
        <h6>Choose your vehicle:</h6>
        <br>
        <div class="select" style="width: 99%;">
            <select id="brand1">
                <jsp:include page="bikeBrand.jsp"></jsp:include>
            </select>
        </div>
        <br>
        <div class="select" style="width: 99%;">
            <select id="models1">
                <option value="">Select Model</option>
            </select>
        </div>
        <br>
        <div class="select" style="width: 99%;">
            <select id="selectCat1">
                <jsp:include page="categories.jsp"></jsp:include>
            </select>
        </div>
        <br>
    </div>
    <div class="mobileDisplayOption col-sm-12">
        <a style="margin-top: 10px; width: 89%;" onclick='searchItem1()' class="button">Search</a>
    </div>
</div>
<%
    if (session.getAttribute("clientId") == null) {
%>
<div class="mobileDisplayOption block-catalog-toolbar clear-nofix" style="margin-top: 30px">
    <div style="width: 100%; text-align: center; height: 35px;" class="view mobileDisplayOption" align="center">
        <h6>Login</h6>
    </div>
    <form style="margin-top: 10px;" action="login" method="post" class="block-cont mobileDisplayOption">
        <div class="input">
            <input type="text" name="username" placeholder="Username" required>
        </div>
        <br>
        <div class="input">
            <input type="password" name="password" placeholder="Password" required>
        </div>
        <div class="mobileDisplayOption col-sm-12">
            <button style="margin-top: 10px; width: 100%;" type="submit" class="button">Login Now</button>
        </div>
    </form>
</div>
<%
    }
%>