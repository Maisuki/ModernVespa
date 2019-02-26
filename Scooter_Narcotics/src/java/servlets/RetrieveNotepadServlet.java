package servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "RetrieveNotepadServlet", urlPatterns = {"/retrieveNp"})
public class RetrieveNotepadServlet extends HttpServlet {
    
    // When user first enter view notepad
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer") == null ? (String)request.getAttribute("Referer") : request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        System.out.println(referer);
        
        if (!RefererCheckManager.refererCheck(referer, "account.jsp", "personalinfo.jsp", "orders.jsp", "view-notepad.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("clientId") == null) {
            request.getSession().invalidate();
            response.sendRedirect("login.jsp?page=view-notepad.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
        
        String clientId = (String) request.getSession().getAttribute("clientId");
        String POST_URL = Global.BASE_URL + "/getNpList";
        String POST_PARAMS = "clientId=" + clientId;
        String results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject jsonResults = new JsonParser().parse(results).getAsJsonObject();
        boolean status = jsonResults.get("status").getAsBoolean();
        if (status) {
            JsonObject allnps = jsonResults.get("notepads").getAsJsonObject();
            JsonArray activenps = allnps.get("active").getAsJsonArray();
            JsonArray inactivenps = allnps.get("inactive").getAsJsonArray();
            
            ServletContext application = getServletContext();
            application.setAttribute("activenps", activenps);
            application.setAttribute("inactivenps", inactivenps);
            
            response.sendRedirect("view-notepad.jsp");
        }
        else {
            response.sendRedirect("index.jsp");
        }
    }
    
    // When user select a notepad to view
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       if (request.getHeader("Referer") == null && request.getParameter("Referer") == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }        
        
        if (request.getSession().getAttribute("clientId") == null) {
            request.getSession().invalidate();
            response.sendRedirect("login.jsp?page=view-notepad.jsp&message=Session%20Expired%21%20Please%20relogin%21");
            return;
        }
        
        String notepadId = request.getParameter("npId");
        String clientId = (String) request.getSession().getAttribute("clientId");
        
        String POST_URL = Global.BASE_URL + "/getNpList";
        String POST_PARAMS = "clientId=" + clientId + "&npId=" + notepadId;
        String results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject jsonResults = new JsonParser().parse(results).getAsJsonObject();
        boolean status = jsonResults.get("status").getAsBoolean();
        if (status) {
            JsonObject allnps = jsonResults.get("notepads").getAsJsonObject();
            JsonArray activenps = allnps.get("active").getAsJsonArray();
            JsonArray inactivenps = allnps.get("inactive").getAsJsonArray();
            
            ServletContext application = getServletContext();
            application.setAttribute("activenps", activenps);
            application.setAttribute("inactivenps", inactivenps);
            
            response.sendRedirect("view-notepad.jsp");
        }
        else {
            response.sendRedirect("index.jsp");
        }
    }

}
