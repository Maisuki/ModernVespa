function searchItem(){
    model=$("#models").val().replace("&","%26");
    brand=$("#brand").val().replace("&","%26");
    cat=$("#selectCat").val().replace("&","%26");
    window.location.href="products.jsp?cat="+cat+"&brand="+brand+"&model="+model;    
}
function searchItem1(){
    model=$("#models1").val().replace("&","%26");
    brand=$("#brand1").val().replace("&","%26");
    cat=$("#selectCat1").val().replace("&","%26");
    window.location.href="products.jsp?cat="+cat+"&brand="+brand+"&model="+model;   
}