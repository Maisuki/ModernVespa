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
import javax.servlet.http.HttpSession;

@WebServlet(name = "ActivateServlet", urlPatterns = {"/activate"})
public class ActivateServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String key = request.getParameter("verify");
        String email = request.getParameter("email");
        
        if (key != null && !key.trim().isEmpty() && email != null && !email.trim().isEmpty()) {
            String POST_URL = Global.BASE_URL + "/activateAccount";
            String POST_PARAMS = "email=" + email + "&key=" + key;
            
            String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
            JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
            boolean status = obj.get("status").getAsBoolean();
            if (!status) {
                response.getWriter().println("Invalid activation details provided!");
                return;
            }
            String message = obj.get("message").getAsString();
            
            HttpSession session = request.getSession();
            session.setAttribute("verification_msg", message);
            session.setAttribute("verification_status", status);
            response.sendRedirect("login.jsp");
        }
        else {
            response.sendRedirect("index.jsp");
        }
    }
}
