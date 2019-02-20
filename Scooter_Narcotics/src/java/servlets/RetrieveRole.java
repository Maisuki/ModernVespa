package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import common.Global;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "RetrieveRole", urlPatterns = {"/retrieveRoles"})
public class RetrieveRole extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (request.getHeader("Referer") == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String GET_URL = Global.BASE_URL + "/roles";
        JsonElement results = SNServer.sendGET(GET_URL);
        JsonObject obj = results.getAsJsonObject();
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
