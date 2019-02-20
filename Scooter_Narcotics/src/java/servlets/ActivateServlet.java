package servlets;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "ActivateServlet", urlPatterns = {"/activate"})
public class ActivateServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String key = request.getParameter("verify");
        String email = request.getParameter("email");
        String type = request.getParameter("type");
        
        if (key != null && email != null && type != null &&
                key.length() != 0 && email.length() != 0 && type.length() != 0) {
            String POST_PARAMS = "", POST_URL = "";
            if (type.equals("sn")) {
                POST_URL = Global.BASE_URL + "/activateAccount";
                POST_PARAMS = "email=" + email + "&key=" + key;
            }
            else if (type.equals("fb")) {
                POST_URL = Global.BASE_URL + "/activateFBAccount";
                POST_PARAMS = "email=" + email + "&key=" + key;
            }
            else if (type.equals("google")) {
                POST_URL = Global.BASE_URL + "/activateGoogleAccount";
                POST_PARAMS = "email=" + email + "&key=" + key;
            }
            
            String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
            JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
            boolean status = obj.get("status").getAsBoolean();
            String message = obj.get("message").getAsString();
            
            HttpSession session = request.getSession();
            session.setAttribute("verification_msg", message);
            session.setAttribute("verification_status", status);
            response.sendRedirect("login.jsp");
        }
    }
}
