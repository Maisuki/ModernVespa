package servlets;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "SelectBnMServlet", urlPatterns = {"/selectBnM"})
public class SelectBnMServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String id = request.getParameter("id");
        String brandnModel= request.getParameter("json");
        String POST_URL = Global.BASE_URL+"/addProductPhase2";
        String POST_PARAMS = "pId=" + id + "&brandNmodel=" + brandnModel;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();

        if (!status) {
            String message = obj.get("message").getAsString();
            request.setAttribute("message", message);
            return;
        }
//        String url = "products.jsp";
        String url = "selectRelatedProducts.jsp?id=" + id;
        response.sendRedirect(url);
    }
    
}