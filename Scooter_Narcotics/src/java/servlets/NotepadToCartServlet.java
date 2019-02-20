package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import common.MessageHandler;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "NotepadToCartServlet", urlPatterns = {"/npToCart"})
public class NotepadToCartServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "view-notepad.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("clientId") == null) {
            request.getSession().invalidate();
            response.sendRedirect("login.jsp?page=view-notepad.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
        
        String clientId = (String) request.getSession().getAttribute("clientId");
        String notepadId = request.getParameter("npId");
        
        if (notepadId == null || notepadId.trim().isEmpty()) {
            JsonObject error = MessageHandler.errorMessageGenerator("notepadId is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/npToCart";
        String POST_PARAMS = "clientId=" + clientId + "&npId=" + notepadId;
        String results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject jsonResults = new JsonParser().parse(results).getAsJsonObject();
        boolean status = jsonResults.get("status").getAsBoolean();
        if (!status) {
            String message = jsonResults.get("message").getAsString();
            JsonObject error = MessageHandler.errorMessageGenerator(message);
            response.getWriter().println(new Gson().toJson(error));
        }
        else {
            JsonObject success = MessageHandler.successMessageGenerator("Successfully copied items to your cart...");
            response.getWriter().println(new Gson().toJson(success));
        }
    }
    
}
