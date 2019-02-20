package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "UpdateProductServlet", urlPatterns = {"/updateProduct"})
public class UpdateProductServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateProduct.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String productId = request.getParameter("productId");
        
        if (productId == null || productId.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Product ID is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        

        String productName = request.getParameter("productName");
        String partNo = request.getParameter("partNumber");

        String category = request.getParameter("category");
        category = category.replace("&", "%26");
        String quantity = request.getParameter("quantity");
        String foreignprice = request.getParameter("foreignprice");
        String localprice = request.getParameter("localprice");
        String weight = request.getParameter("weight");
        String sourceOfSupply = request.getParameter("sos");
        String secSourceOfSupply = request.getParameter("ssos");
        String costOfProduct = request.getParameter("cop");
        String productBrand = request.getParameter("pBrand");
        String[] checked = request.getParameterValues("fProduct");
        String description = request.getParameter("desc");
        description = description.replace(" ", "%20");
        String gst = request.getParameter("gst");

        // discountedprice
//        String tier1DiscountedPrice = request.getParameter("tier1discountedprice");
//        String tier2DiscountedPrice = request.getParameter("tier2discountedprice");
//        String tier3DiscountedPrice = request.getParameter("tier3discountedprice");
//        String tier4DiscountedPrice = request.getParameter("tier4discountedprice");

        // markup percentage
        String tier1MarkupPercentage = request.getParameter("tier1markup");
        String tier2MarkupPercentage = request.getParameter("tier2markup");
        String tier3MarkupPercentage = request.getParameter("tier3markup");
        String tier4MarkupPercentage = request.getParameter("tier4markup");

        // markup price
//        String tier1MarkupPrice = request.getParameter("tier1markupprice");
//        String tier2MarkupPrice = request.getParameter("tier2markupprice");
//        String tier3MarkupPrice = request.getParameter("tier3markupprice");
//        String tier4MarkupPrice = request.getParameter("tier4markupprice");

        String shippingCosts = request.getParameter("shippingcosts");

        boolean featuredProduct = false;
        if (checked != null) {
            featuredProduct = true;
        }
        
        String POST_URL = Global.BASE_URL + "/updateProduct";
        String POST_PARAMS = "pName=" + productName + "&partNo=" + partNo + "&pCategory=" + category + "&pQty=" + quantity
                + "&pFMPrice=" + foreignprice + "&pLMPrice=" + localprice + "&pWeight=" + weight + "&sos=" + sourceOfSupply
                + "&ssos=" + secSourceOfSupply + "&cop=" + costOfProduct + "&pDesc=" + description + "&pFeatured=" + featuredProduct
                + "&pBrand=" + productBrand 
//                + "&tier1discountedprice=" + tier1DiscountedPrice + "&tier2discountedprice=" + tier2DiscountedPrice
//                + "&tier3discountedprice=" + tier3DiscountedPrice + "&tier4discountedprice=" + tier4DiscountedPrice
                + "&tier1markup=" + tier1MarkupPercentage + "&tier2markup=" + tier2MarkupPercentage
                + "&tier3markup=" + tier3MarkupPercentage + "&tier4markup=" + tier4MarkupPercentage + "&gst=" + gst
                + "&shippingcosts=" + shippingCosts + "&pId=" + productId + "&action=text";
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        if (!status) {
            String message = obj.get("message").getAsString();
            request.setAttribute("message", message);
            return;
        }
        String url = "updateMenu.jsp?pid=" + productId;
        response.sendRedirect(url);
    }
}
