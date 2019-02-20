package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import controller.RefererCheckManager;
import java.io.IOException;
import java.util.List;
import java.util.TreeMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "PopulateModelServlet", urlPatterns = {"/populateModel"})
public class PopulateModelServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer)) {
            response.getWriter().println("Unauthorized access!");
            return;
        }

        String selectedBrand = request.getParameter("brand");
        TreeMap<String, List<String>> bnmMap = (TreeMap<String, List<String>>) request.getSession().getAttribute("bnm");
        JsonObject modelsJson = new JsonObject();
        JsonArray modelArr = new JsonArray();
        if (bnmMap.containsKey(selectedBrand)) {
            List<String> modelList = bnmMap.get(selectedBrand);
            for (String model : modelList) {
                modelArr.add(model);
            }
            modelsJson.add("models", modelArr);
        } else {
            modelsJson.add("models", null);
        }
        response.getWriter().println(new Gson().toJson(modelsJson));
    }
    
}
