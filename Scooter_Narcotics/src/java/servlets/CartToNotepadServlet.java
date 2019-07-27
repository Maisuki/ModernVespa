package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "CartToNotepadServlet", urlPatterns = {"/cartToNp"})
public class CartToNotepadServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "shop-cart.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("clientId") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to add your cart items to a new notepad!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        String remoteAddr = request.getRemoteAddr();
        String xForwardedFor = request.getHeader("x-forwarded-for");
        String clientId = (String) request.getSession().getAttribute("clientId");
        
        String notepadName = request.getParameter("npName");
        
        if (notepadName == null || notepadName.trim().isEmpty()) {
            Date now = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            notepadName = "New Notepad From Cart " + sdf.format(now);
            notepadName = notepadName.replaceAll("/", "%2F");
        }
        
        String POST_URL = Global.BASE_URL + "/addNp";
        String POST_PARAMS = "clientId=" + clientId + "&npName=" + notepadName + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        POST_PARAMS = POST_PARAMS.replaceAll(" ", "%20");
        
        JsonElement results = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = results.getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
