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

@WebServlet(name = "RemoveImageServlet", urlPatterns = {"/removeImage"})
public class RemoveImageServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateProductImage.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String action = "image";
        String addOrRemove = "-";
        String pId = request.getParameter("pId");
        String index = request.getParameter("index");
        
        if (pId == null || pId.trim().isEmpty() ||
                index == null || index.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "pId and index are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/updateProduct";
        String POST_PARAMS = "pId=" + pId + "&addOrRemove=" + addOrRemove + "&indexToRemove=" + index + "&action=" + action;
        String results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(results).getAsJsonObject();
        response.getWriter().println(new Gson().toJson(obj));
    }

}
