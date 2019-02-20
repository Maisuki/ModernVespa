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

@WebServlet(name = "UpdateProductBnMServlet", urlPatterns = {"/updateProductBnM"})
public class UpdateProductBnMServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateProductBNM.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String id = request.getParameter("pId");
        String brandnModel = request.getParameter("bnm");
        String POST_URL = Global.BASE_URL + "/updateProduct";
        String POST_PARAMS = "pId=" + id + "&brandNmodel=" + brandnModel + "&action=text";
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        response.getWriter().println(new Gson().toJson(obj));
    }
}
