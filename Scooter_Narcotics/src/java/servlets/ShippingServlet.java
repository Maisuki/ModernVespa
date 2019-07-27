package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.easypost.EasyPost;
import com.easypost.exception.EasyPostException;
import com.easypost.model.Order;
import com.easypost.model.Rate;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import common.getRates;
import controller.RefererCheckManager;
import controller.SNServer;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@WebServlet(name = "ShippingServlet", urlPatterns = {"/ship"})
public class ShippingServlet extends HttpServlet {

    private double totalPrice = 0;
    private double totalWeight = 0;
    private HashMap<String, Double> UPSRateMap = new HashMap<>();
    private HashMap<String, Double> FEDEXRateMap = new HashMap<>();
    private HashMap<String, Double> DHLRateMap = new HashMap<>();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "shop-checkout-particulars.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("clientId") == null) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "You must login to proceed with your checkout process!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        String xForwardedFor = request.getHeader("x-forwarded-for");
        String remoteAddr = request.getRemoteAddr();
        String clientId = (String) request.getSession().getAttribute("clientId");
        
        EasyPost.apiKey = Global.EASYPOST;

        String POST_URL = Global.BASE_URL + "/retrieveCart";
        String POST_PARAMS = "clientId=" + clientId + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        
        JsonObject obj = result.getAsJsonObject();
        JsonObject toAddress = new JsonObject();
        toAddress.addProperty("name", request.getParameter("toName"));
        toAddress.addProperty("street1", request.getParameter("toAdd1"));
        toAddress.addProperty("street2", request.getParameter("toAdd2"));
        toAddress.addProperty("city", request.getParameter("toCity"));
        toAddress.addProperty("state", request.getParameter("toState"));
        toAddress.addProperty("zip", request.getParameter("toPostal"));
        toAddress.addProperty("phone", request.getParameter("toContact"));
        toAddress.addProperty("country", request.getParameter("toCountry"));
        String ccode = request.getParameter("ccode");
        double conRate = getRates.getConRate(ccode);

        List<Order> orderList = new ArrayList<>();
        // loop required
        JsonObject shoppingCartObj = obj.getAsJsonObject("cart");
        JsonArray cartItemsArr = shoppingCartObj.getAsJsonArray("cart_items");
        String message = "";
        request.getSession().setAttribute("cart_id", obj.getAsJsonObject("cart").get("_id").getAsString());

        POST_URL = Global.BASE_URL + "/verifyAvailability";
        String POST_PARAM = "clientId=" + clientId + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        JsonElement verifyResult = SNServer.sendPOST(POST_URL, POST_PARAM);
        JsonObject verifyData = verifyResult.getAsJsonObject();
        JsonArray shipmentInfo = new JsonArray();
        JsonArray cartItemArr = new JsonArray();
        JsonObject shipmentObj = new JsonObject();
        JsonObject itemDetails;
        JsonArray outStockCartItemArr = new JsonArray();
        JsonObject outStockItemDetails;
        if (!verifyData.get("status").getAsBoolean() && request.getSession().getAttribute("SH") != null) {
            for (int i = 0; i < cartItemsArr.size(); i++) {
                JsonObject cartItem = cartItemsArr.get(i).getAsJsonObject();
                JsonArray msg = verifyData.get("messages").getAsJsonArray();
                itemDetails = new JsonObject();
                for (int j = 0; j < msg.size(); j++) {
                    String pName = cartItem.get("name").getAsString();
                    JsonObject msgObj = msg.get(j).getAsJsonObject();
                    String outStockItemName = msgObj.get("item").getAsString();
                    if (pName.equals(outStockItemName)) {
                        outStockItemDetails = new JsonObject();
                        itemDetails = new JsonObject();
                        itemDetails.addProperty("weight", cartItem.get("weight").getAsString());
                        itemDetails.addProperty("qty", msgObj.get("availableQty").getAsString());
                        itemDetails.addProperty("price", cartItem.get("price").getAsString());
                        outStockItemDetails.addProperty("weight", cartItem.get("weight").getAsString());
                        outStockItemDetails.addProperty("qty", cartItem.get("qty").getAsInt() - msgObj.get("availableQty").getAsInt());
                        outStockItemDetails.addProperty("price", cartItem.get("price").getAsString());
                        outStockCartItemArr.add(outStockItemDetails);
                    } else {
                        itemDetails.addProperty("weight", cartItem.get("weight").getAsString());
                        itemDetails.addProperty("qty", msgObj.get("availableQty").getAsString());
                        itemDetails.addProperty("price", cartItem.get("price").getAsString());
                    }
                    cartItemArr.add(itemDetails);
                }
            }
        }
        else {
            try {
                for (int i = 0; i < cartItemsArr.size(); i++) {
                    JsonObject cartItem = cartItemsArr.get(i).getAsJsonObject();
                    itemDetails = new JsonObject();
                    itemDetails.addProperty("weight", cartItem.get("weight").getAsString());
                    itemDetails.addProperty("qty", cartItem.get("qty").getAsString());
                    itemDetails.addProperty("price", cartItem.get("price").getAsString());
                    cartItemArr.add(itemDetails);
                }
            }
            catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        try {
            UPSRateMap = new HashMap<>();
            FEDEXRateMap = new HashMap<>();
            DHLRateMap = new HashMap<>();
            
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            JsonObject UPSRateJson = new JsonObject();
            JsonArray UPSarr = new JsonArray();
            JsonObject UPSJson = new JsonObject();
            JsonObject FEDEXRateJson = new JsonObject();
            JsonArray FEDEXarr = new JsonArray();
            JsonObject FEDEXJson = new JsonObject();
            JsonObject DHLRateJson = new JsonObject();
            JsonArray DHLarr = new JsonArray();
            JsonObject DHLJson = new JsonObject();
            Order shipNowOrder = null;
            Order shipLaterOrder = null;
            if (cartItemArr.size() > 0) {
                JsonArray shipNowArr = checkWeight(cartItemArr);
                JsonObject data = createOrder(shipNowArr, toAddress);
                if (data.get("status").getAsBoolean()) {
                    JsonObject orderObject = data.get("order").getAsJsonObject();
                    String orderId = orderObject.get("id").getAsString();
                    shipNowOrder = Order.retrieve(orderId);
                    setRate(shipNowOrder);
                } else {
                    message = "Opps... something went wrong, Please Try again";
                }
            }
            if (outStockCartItemArr.size() > 0) {
                JsonArray shipLaterArr = checkWeight(outStockCartItemArr);
                JsonObject data = createOrder(shipLaterArr, toAddress);
                if (data.get("status").getAsBoolean()) {
                    JsonObject orderObject = data.get("order").getAsJsonObject();
                    String orderId = orderObject.get("id").getAsString();
                    shipLaterOrder = Order.retrieve(orderId);
                    setRate(shipLaterOrder);
                } else {
                    message = "Opps... something went wrong, Please Try again";
                }
            }
            if (UPSRateMap.size() > 0) {
                Set<String> UPSServices = UPSRateMap.keySet();
                for (String service : UPSServices) {
                    UPSRateJson.addProperty("service", service);
                    UPSRateJson.addProperty("rate", UPSRateMap.get(service) * Global.MARK_UP_RATE * conRate);
//                    UPSRateJson.addProperty("rate", (UPSRateMap.get(service) / Global.MARK_UP_RATE) * conRate);
                    UPSarr.add(UPSRateJson);
                    UPSRateJson = new JsonObject();
                    
                }
                UPSJson.add("UPS", UPSarr);
            }
            if (FEDEXRateMap.size() > 0) {
                Set<String> FedexService = FEDEXRateMap.keySet();
                for (String service : FedexService) {
                    FEDEXRateJson.addProperty("service", service);
                    FEDEXRateJson.addProperty("rate", FEDEXRateMap.get(service) * Global.MARK_UP_RATE * conRate);
//                    FEDEXRateJson.addProperty("rate", (FEDEXRateMap.get(service) / Global.MARK_UP_RATE) * conRate);
                    FEDEXarr.add(UPSRateJson);
                    UPSRateJson = new JsonObject();
                }
                FEDEXJson.add("UPS", UPSarr);
            }
            if (DHLRateMap.size() > 0) {
                Set<String> DHLService = DHLRateMap.keySet();
                for (String service : DHLService) {
                    DHLRateJson.addProperty("service", service);
                    DHLRateJson.addProperty("rate", DHLRateMap.get(service) * Global.MARK_UP_RATE * conRate);
//                    DHLRateJson.addProperty("rate", (DHLRateMap.get(service) / Global.MARK_UP_RATE) * conRate);
                    DHLarr.add(DHLRateJson);
                    DHLRateJson = new JsonObject();
                }
                DHLJson.add("FEDEX", DHLarr);
            }

            request.getSession().setAttribute("UPS", gson.toJson(UPSJson));
            request.getSession().setAttribute("FEDEX", gson.toJson(FEDEXJson));
            request.getSession().setAttribute("DHL", gson.toJson(DHLJson));
            request.getSession().setAttribute("price", totalPrice);
            request.getSession().setAttribute("weight", totalWeight);
            request.getSession().setAttribute("shipOrder", shipNowOrder);
            request.getSession().setAttribute("shipLaterOrder", shipLaterOrder);
            request.getSession().setAttribute("toAddress", toAddress);
            request.getSession().setAttribute("cart", shoppingCartObj);
            request.getSession().setAttribute("conRate", conRate);

            response.setContentType("text/html;charset=UTF-8");
        } catch (EasyPostException | IOException ex) {
            message = "Opps... something went wrong, Please Try again";
        } finally {
            try (PrintWriter out = response.getWriter()) {
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                JsonObject error = new JsonObject();
                error.addProperty("status", message.equals(""));
                error.addProperty("message", message);
                out.print(gson.toJson(error));

            } catch (IOException ex) {

            }
        }
    }

    private int roundDown(double number, double place) {
        double result = number / place;
        result = Math.floor(result);
        result *= place;
        return (int) result;
    }

    private JsonObject createOrder(JsonArray parcel, JsonObject toAddress) throws IOException {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String POST_URL = Global.BASE_URL + "/createOrder";
        String POST_PARAM = "to=" + gson.toJson(toAddress) + "&parcelData=" + gson.toJson(parcel);
        JsonElement result = SNServer.sendPOST(POST_URL, POST_PARAM);
        JsonObject data = result.getAsJsonObject();
        return data;
    }

    private JsonArray checkWeight(JsonArray cartItemsArr) {
        totalPrice = 0.0;
        totalWeight = 0.0;
        JsonArray parcelsArr = new JsonArray();
        JsonObject parcelObj = new JsonObject();
        double weight = 0.0;
        for (int i = 0; i < cartItemsArr.size(); i++) {
            JsonObject cartItem = cartItemsArr.get(i).getAsJsonObject();
            double itemWeight = cartItem.get("weight").getAsDouble();
            int itemQty = cartItem.get("qty").getAsInt();
            double itemPrice = cartItem.get("price").getAsDouble();
            double itemTotalWeight = itemWeight * itemQty;
            totalWeight += itemTotalWeight;
            
            if ((weight + itemTotalWeight) > 70) {
                int numberofQty = roundDown((70 - weight) / itemWeight, 10);
                double roundDownWeight = itemWeight * numberofQty;
                weight += itemWeight * numberofQty;
                parcelObj.addProperty("weight", weight * Global.KG_TO_OZ);
                parcelsArr.add(parcelObj);
                parcelObj = new JsonObject();
                weight = itemWeight * (itemQty - numberofQty);
            }
            else {
                weight += itemTotalWeight;
            }
            totalPrice += itemPrice * itemQty;
        }
        parcelObj.addProperty("weight", weight * Global.KG_TO_OZ);
        parcelsArr.add(parcelObj);
        return parcelsArr;
    }

    private void setRate(Order order) {
        for (Rate rate : order.getRates()) {
            if (rate.getCarrier().equals("UPS")) {
                if (UPSRateMap.get(rate.getService()) == null) {
                    String service = rate.getService();
                    Float rateAmt = rate.getRate();
                    UPSRateMap.put(rate.getService(), Double.parseDouble(rate.getRate().toString()));
                } else {
                    double upsRate = UPSRateMap.get(rate.getService());
                    upsRate += Double.parseDouble(rate.getListRate().toString());
                    UPSRateMap.put(rate.getService(), upsRate);
                }
            } else if (rate.getCarrier().equals("FEDEX") && (rate.getService().equals("INTERNATIONAL_ECONOMY") || rate.getService().equals("INTERNATIONAL_PRIORITY"))) {
                if (FEDEXRateMap.get(rate.getService()) == null) {
                    FEDEXRateMap.put(rate.getService(), Double.parseDouble(rate.getRate().toString()));
                } else {
                    double fedexRate = FEDEXRateMap.get(rate.getService());
                    fedexRate += Double.parseDouble(rate.getListRate().toString());
                    FEDEXRateMap.put(rate.getService(), fedexRate);
                }
            } else if (rate.getCarrier().equals("DHL eCommerce International") && (rate.getService().equals("DHLParcelInternationalPriority") || rate.getService().equals("DHLParcelInternationalStandard"))) {
                if (DHLRateMap.get(rate.getService()) == null) {
                    DHLRateMap.put(rate.getService(), Double.parseDouble(rate.getRate().toString()));
                } else {
                    double dhlRate = DHLRateMap.get(rate.getService());
                    dhlRate += Double.parseDouble(rate.getListRate().toString());
                    DHLRateMap.put(rate.getService(), dhlRate);
                }
            }
        }
    }
}