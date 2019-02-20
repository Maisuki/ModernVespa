package servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import controller.ValidationManager;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "UpdateUserDetailsServlet", urlPatterns = {"/updateUserInfo"})
public class UpdateUserDetailsServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "personalinfo.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("clientId") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to change your account details!");
            response.getWriter().println(new Gson().toJson(error));
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
        
        String clientId = (String) request.getSession().getAttribute("clientId");

        String fname = request.getParameter("fname");
        String lname = request.getParameter("lname");
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String contact = request.getParameter("contact");
        String street = request.getParameter("street");
        String city = request.getParameter("city");
        String zip = request.getParameter("zip");
        String state = request.getParameter("state");
        String country = request.getParameter("country");

        if (fname == null || fname.trim().isEmpty() ||
                lname == null || lname.trim().isEmpty() ||
                username == null || username.trim().isEmpty() ||
                email == null || email.trim().isEmpty() ||
                contact == null || contact.trim().isEmpty() ||
                street == null || street.trim().isEmpty() ||
                city == null || city.trim().isEmpty() ||
                zip == null || zip.trim().isEmpty() ||
                state == null || state.trim().isEmpty() ||
                country == null || country.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "First Name, Last Name, Username, Email, Contact, Address Details are required!");
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

        String POST_URL = Global.BASE_URL + "/updateUserDetails";
        String POST_PARAMS = "clientId=" + clientId +"&username=" + username + "&fname=" + fname
                + "&lname=" + lname + "&email=" + email + "&billAddress=" + addressJson
                + "&contact=" + contact;

        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        if (status) {
            POST_URL = Global.BASE_URL + "/retrieveUser";
            POST_PARAMS = "clientId=" + clientId;
            result = SNServer.sendPOST(POST_URL, POST_PARAMS);
            JsonObject resultObj = new JsonParser().parse(result).getAsJsonObject();

            JsonObject userObj = resultObj.get("user").getAsJsonObject();
            String fullName = userObj.get("fname").getAsString() + " " + userObj.get("lname").getAsString();
            email = userObj.get("email").getAsString();
            contact = userObj.get("contact").getAsString();

            HttpSession session = request.getSession();
            request.getSession().setAttribute("user", userObj);
            session.setAttribute("name", fullName);
            session.setAttribute("email", email);
            session.setAttribute("contact", contact);
        }
        
        response.getWriter().println(new Gson().toJson(obj));
        

        
        
//        POST_URL = Global.BASE_URL + "/retrieveUser";
//        POST_PARAMS = "clientId=" + clientId;
//        result = SNServer.sendPOST(POST_URL, POST_PARAMS);
//        obj = new JsonParser().parse(result).getAsJsonObject();
//        
//        JsonObject userObj = obj.get("user").getAsJsonObject();
//        String fullName = userObj.get("fname").getAsString() + " " + userObj.get("lname").getAsString();
//        email = userObj.get("email").getAsString();
//        contact = userObj.get("contact").getAsString();
//        
//        HttpSession session = request.getSession();
//        request.getSession().setAttribute("user", userObj);
//        session.setAttribute("name", fullName);
//        session.setAttribute("email", email);
//        session.setAttribute("contact", contact);
//        
//        request.setAttribute("message", "You have successfully updated your details.");
//        RequestDispatcher homepage = request.getRequestDispatcher("personalinfo.jsp");
//        homepage.forward(request, response);
    }
    
    private void returnToPersonalInfoPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        RequestDispatcher view = request.getRequestDispatcher("personalinfo.jsp");
        request.setAttribute("fname", request.getParameter("fname"));
        request.setAttribute("lname", request.getParameter("lname"));
        request.setAttribute("username", request.getParameter("username"));
        request.setAttribute("email", request.getParameter("email"));
        request.setAttribute("contact", request.getParameter("contact"));
        request.setAttribute("street", request.getParameter("street"));
        request.setAttribute("city", request.getParameter("city"));
        request.setAttribute("zip", request.getParameter("zip"));
        request.setAttribute("state", request.getParameter("state"));
        request.setAttribute("country", request.getParameter("country"));
        view.forward(request, response);
    }
    
}
