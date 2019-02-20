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

@WebServlet(name = "WriteReviewServlet", urlPatterns = {"/writeReview"})
public class WriteReviewServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "shop-details.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!referer.contains("?")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        String parameter = referer.split("\\?")[1];
        if (!parameter.contains("=")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        String parameterKey = parameter.split("=")[0];
        String parameterValue = parameter.split("=")[1];
        
        if (!parameterKey.equals("productId") || parameterValue.equals("")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("user") == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        JsonObject user = (JsonObject) request.getSession().getAttribute("user");
        String fname = user.get("fname").getAsString();
        String productReviewComment = request.getParameter("productReview");
        String productReviewRating = request.getParameter("productRating");
        
        if (productReviewComment == null || productReviewRating == null) {
            JsonObject obj = new JsonObject();
            obj.addProperty("status", false);
            obj.addProperty("message", "productReview and productRating are required!");
            response.getWriter().println(new Gson().toJson(obj));
            return;
        }
        
        String POST_URL = Global.BASE_URL + "/writeReview";
        String POST_PARAMS = "productId=" + parameterValue + "&productReviewer=" +  fname;
        POST_PARAMS += "&productReview=" + productReviewComment + "&productRating=" + productReviewRating;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject resultObj = new JsonParser().parse(result).getAsJsonObject();
        
        response.getWriter().println(new Gson().toJson(resultObj));
    }
    
}
