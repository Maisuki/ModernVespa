package servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import controller.ValidationManager;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "RegisterGoogleServlet", urlPatterns = {"/registerGoogle"})
public class RegisterGoogleServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "registration.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        // Verify if recaptcha is being checked
        if (!controller.SNServer.verifyRecaptcha(request.getParameter("g-recaptcha-response"))) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Captcha verification fail!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        String googleId = request.getParameter("id");
        String email = request.getParameter("email");
        String fname = request.getParameter("fname");
        String lname = request.getParameter("lname");
        String contact = request.getParameter("contact");
        String street = request.getParameter("street");
        String city = request.getParameter("city");
        String zip = request.getParameter("zip");
        String state = request.getParameter("state");
        String country = request.getParameter("country");
        String role = request.getParameter("role");

        if (googleId == null || googleId.trim().isEmpty()
                || fname == null || fname.trim().isEmpty()
                || lname == null || lname.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || city == null || city.trim().isEmpty()
                || state == null || state.trim().isEmpty()
                || street == null || street.trim().isEmpty()
                || zip == null || zip.trim().isEmpty()
                || country == null || country.trim().isEmpty()
                || contact == null || contact.trim().isEmpty()
                || role == null || role.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "First Name, Last Name, Email, City, State, Street, Zip, Country, Contact and Role values are required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        boolean validEmail = ValidationManager.validateEmail(request.getParameter("email"));

        if (!validEmail) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Invaild Email!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }

        JsonObject addressObj = new JsonObject();
        addressObj.addProperty("city", city);
        addressObj.addProperty("country", country);
        addressObj.addProperty("street", street);
        addressObj.addProperty("zip", zip);
        addressObj.addProperty("state", state);
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String addressJson = gson.toJson(addressObj);

        String POST_URL = Global.BASE_URL + "/registerGoogle";
        String POST_PARAMS = "id=" + googleId + "&fname=" + request.getParameter("fname")
                + "&lname=" + request.getParameter("lname") + "&email=" + request.getParameter("email") + "&billAddress=" + addressJson
                + "&contact=" + request.getParameter("contact") + "&role=" + request.getParameterValues("role")[0];

        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = result.getAsJsonObject();
        
        boolean status = obj.get("status").getAsBoolean();

        if (status) {
            String key = obj.get("key").getAsString();
            String fname1 = fname.replaceAll(" ", "%20");
            
            if (role.equals("Dealer")) {
                String sendEmail = "https://scooter-narcotics.com/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&type=google&action=2";
//                String sendEmail = "http://128.199.66.178/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&action=2";
                SNServer.sendGET(sendEmail);
            }
            String sendEmail = "https://scooter-narcotics.com/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&type=google&action=1";
//            String sendEmail = "http://128.199.66.178/ScooterEmailer/mail?email=" + email + "&key=" + key + "&name=" + fname1 + "&type=google&action=1";
            SNServer.sendGET(sendEmail);
        }
        
        response.getWriter().println(new Gson().toJson(obj));
    }
    
}
