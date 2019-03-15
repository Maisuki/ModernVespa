package servlets;

import com.easypost.EasyPost;
import com.easypost.exception.EasyPostException;
import com.easypost.model.Order;
import com.easypost.model.Rate;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.stripe.Stripe;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.model.Charge;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "PaymentServlet", urlPatterns = {"/processPayment"})
public class PaymentServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "shop-checkout-shipping.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (request.getSession().getAttribute("clientId") == null) {
            errorMsg("You must login to make payment!", response);
            return;
        }
        
        String xForwardedFor = request.getHeader("x-forwarded-for");
        String remoteAddr = request.getRemoteAddr();
        String clientId = (String) request.getSession().getAttribute("clientId");
        
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        Stripe.apiKey = Global.STRIPE;
        Stripe.apiVersion = "2017-02-14";
        EasyPost.apiKey = Global.EASYPOST;
        // Token is created using Checkout or Elements!
        // Get the payment token ID submitted by the form:
        String token = request.getParameter("transactionId");
        String amount = request.getParameter("total");
        String curr = request.getParameter("curr");
        String service = request.getParameter("service");
        String carrier = request.getParameter("carrier");
        String shipcost = request.getParameter("shipcost");
        String paymentType = request.getParameter("paymentType");
        
        if (token == null || token.trim().isEmpty() ||
                amount == null || amount.trim().isEmpty() ||
                curr == null || curr.trim().isEmpty() ||
                service == null || service.trim().isEmpty() ||
                carrier == null || carrier.trim().isEmpty() ||
                shipcost == null || shipcost.trim().isEmpty() ||
                paymentType == null || paymentType.trim().isEmpty()) {
            errorMsg("transactionId, total, curr, service, carrier, shipcost and paymentType are required!", response);
            return;
        }
        
        String cart_id = request.getSession().getAttribute("cart_id").toString();

        JsonObject cart = (JsonObject) request.getSession().getAttribute("cart");
        JsonObject toAddress = (JsonObject) request.getSession().getAttribute("toAddress");
        boolean shipNow = (Boolean) request.getSession().getAttribute("shipNow");
        double conRate = (Double) request.getSession().getAttribute("conRate");

        String errorMsg = "";
        int noPackage = 0;

        request.getSession().setAttribute("error", "");
        amount = amount.substring(4);
        // Charge the user's card:
        try {
            Order shipOrderLater = (Order) request.getSession().getAttribute("shipLaterOrder");
            Order order = (Order) request.getSession().getAttribute("shipOrder");
            if (order != null) {
                List<Rate> rateList = order.getRates();
                Rate chosenRate = null;
                for (Rate rate : rateList) {
                    //edit when shipping accounts are ready
                    if (rate.getService().equals(service)) {
                        chosenRate = rate;
                    }
                }
                noPackage += order.getShipments().size();
                String POST_PARAMS = "";
                String tId = "-";
                String additionalInfo = "-";
                if (paymentType.equals("stripe")) {
                    Map<String, Object> params = new HashMap<>();
                    params.put("amount", (int) (Double.parseDouble(amount) * 100));
                    params.put("currency", curr);
                    params.put("description", "Example charge");
                    params.put("source", token);
                    Charge charge = Charge.create(params);
                    String stripe_id = charge.getId();
                    if (shipNow) {
                        order.buy(chosenRate);
                    }
                    POST_PARAMS = "clientId=" + request.getSession().getAttribute("clientId").toString()
                            + "&cartId=" + cart_id
                            + "&transactionId=" + stripe_id
                            + "&shippingId=" + order.getId()
                            + "&currency=" + curr
                            + "&shippingCosts=" + ((chosenRate.getRate() / Global.MARK_UP_RATE) * conRate)
                            + "&shippingDetails=" + toAddress
                            + "&paymentType=" + paymentType
                            + "&carrier=" + chosenRate.getCarrier()
                            + "&service=" + chosenRate.getService()
                            + "&shipmentInfo=" + cartItem(cart, clientId, shipNow, order, shipOrderLater, xForwardedFor, remoteAddr);
                    tId = stripe_id;
                    if (shipNow) {
                        order.buy(chosenRate);
                    } else {
                        additionalInfo = "Shippment will be shipped when all stocks arrives";
                    }
                } else if (paymentType.equals("PayPal")) {
                    POST_PARAMS = "clientId=" + request.getSession().getAttribute("clientId").toString()
                            + "&cartId=" + cart_id
                            + "&transactionId=" + token
                            + "&shippingId=" + order.getId()
                            + "&currency=" + curr
                            + "&shippingCosts=" + ((chosenRate.getRate() / Global.MARK_UP_RATE) * conRate)
                            + "&shippingDetails=" + toAddress
                            + "&paymentType=" + paymentType
                            + "&carrier=" + chosenRate.getCarrier()
                            + "&service=" + chosenRate.getService()
                            + "&shipmentInfo=" + cartItem(cart, clientId, shipNow, order, shipOrderLater, xForwardedFor, remoteAddr);
                    tId = token;
                    if (shipNow) {
                        order.buy(chosenRate);
                    } else {
                        additionalInfo = "Shipment will be shipped when all stocks arrives";
                    }
                } else {
                    POST_PARAMS = "clientId=" + request.getSession().getAttribute("clientId").toString()
                            + "&cartId=" + cart_id
                            + "&transactionId=-"
                            + "&shippingId=-"
                            + "&currency=" + curr
                            + "&shippingCosts=" + ((chosenRate.getRate() / Global.MARK_UP_RATE) * conRate)
                            + "&shippingDetails=" + toAddress
                            + "&paymentType=" + paymentType
                            + "&carrier=" + chosenRate.getCarrier()
                            + "&service=" + chosenRate.getService()
                            + "&shipmentInfo=" + cartItem(cart, clientId, false, shipOrderLater, order, xForwardedFor, remoteAddr);
                    additionalInfo = "Order will be process when money is wired into xxx account, Kindly infrom us when the transfer is made";
                }
                String POST_URL = Global.BASE_URL + "/payNow";
                String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
                JsonObject data = new JsonParser().parse(result).getAsJsonObject();
                String transactionId = data.get("transactionId").getAsString();
                request.getSession().setAttribute("transactionId", transactionId);
                // check for ship half half shipments (only used for shippment that has been splited 

                if (shipOrderLater != null) {
                    additionalInfo = "- Shipment ID: " + order.id
                            + " will be ship first <br>- Shipment ID: " + shipOrderLater.id
                            + " will be ship when the rest of the stocks arrive";
                }

                if (data.get("status").getAsBoolean()) {
                    String forwarder = chosenRate.getCarrier() + "," + chosenRate.getService();
                    String URL = Global.BASE_URL + "/retrieveCartForInvoice";
                    String CART_POST_PARAMS = "clientId=" + clientId + "&cartId=" + cart_id;
                    String CartResult = SNServer.sendPOST(URL, CART_POST_PARAMS);
                    JsonObject obj = new JsonParser().parse(CartResult).getAsJsonObject();
                    boolean status = obj.get("status").getAsBoolean();
                    Gson gson = new GsonBuilder().setPrettyPrinting().create();
                    if (status) {
                        JsonObject cartObj = obj.getAsJsonObject("cart").getAsJsonObject();
                        String email = request.getSession().getAttribute("email").toString();
                        String SEND_EMAIL_POST_PARAMS = "email=" + email
                                + "&toAddress=" + gson.toJson(toAddress)
                                + "&carrier=" + chosenRate.getCarrier()
                                + "&service=" + chosenRate.getService()
                                + "&paymentType=" + paymentType
                                + "&transId=" + tId
                                + "&clientId=" + clientId
                                + "&shipCost=" + shipcost
                                + "&noPackage=" + noPackage
                                + "&additionalInfo=" + additionalInfo
                                + "&cartObj=" + gson.toJson(cartObj);
                        SEND_EMAIL_POST_PARAMS = SEND_EMAIL_POST_PARAMS.replaceAll(" ", "%20");
                        SNServer.sendPOST("https://scooter-narcotics.com/ScooterEmailer/sendInvoice", SEND_EMAIL_POST_PARAMS);
                        SNServer.sendGET("https://scooter-narcotics.com/ScooterEmailer/mail?action=3");
                        
//                        SNServer.sendPOST("http://159.65.90.252/MailTest/sendInvoice", SEND_EMAIL_POST_PARAMS);
                        String message = "An email is being sent to your email account.";
                        request.setAttribute("message", message);
                        
                        JsonObject res = new JsonObject();
                        res.addProperty("status", true);
                        res.addProperty("message", message);
                        response.getWriter().print(gson.toJson(res));
                    }
                } else {
                    errorMsg += data.get("message").getAsString();
                }
            }
        } catch (AuthenticationException | JsonSyntaxException | APIConnectionException | APIException | InvalidRequestException | IOException | NumberFormatException ex) {
            errorMsg += "Opps something went wrong please contact Adminstration.";
            System.out.println(ex.getMessage());
        } catch (CardException ex) {
//            errorMsg += "Opps something is wrong.. Please check your card details";
            errorMsg += ex.getMessage();
            System.out.println(ex.getMessage());
        } catch (EasyPostException e) {
            JsonObject resultObj = new JsonParser().parse(e.getMessage().substring(e.getMessage().indexOf("{"))).getAsJsonObject();
            JsonObject errorObj = resultObj.get("error").getAsJsonObject();
            errorMsg += errorObj.get("message").getAsString();
            System.out.println(e.getMessage());
        } finally {
            if (!errorMsg.isEmpty()) {
                errorMsg(errorMsg, response);
            }
        }
    }

    private void errorMsg(String msg, HttpServletResponse response) {
        try (PrintWriter out = response.getWriter()) {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", msg);
            out.print(gson.toJson(error));
        } catch (IOException ex) {}
    }

    private String cartItem(JsonObject cart, String clientId, boolean isShipped, Order shipNowOrder, Order shipLaterOrder, String xForwardedFor, String remoteAddr) throws IOException {
        String POST_URL = Global.BASE_URL + "/verifyAvailability";
        String POST_PARAM = "clientId=" + clientId + "&remoteIP=" + xForwardedFor + "&localIP=" + remoteAddr;
        String result = SNServer.sendPOST(POST_URL, POST_PARAM);
        JsonArray cartItems = cart.get("cart_items").getAsJsonArray();
        
        JsonObject data = new JsonParser().parse(result).getAsJsonObject();
        JsonArray shipmentInfo = new JsonArray();
        JsonArray cartItemArr = new JsonArray();
        JsonObject shipmentObj = new JsonObject();
        JsonObject itemDetails;
        JsonArray outStockCartItemArr = new JsonArray();
        JsonObject outStockItemDetails;
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        if (!isShipped) {
            for (int i = 0; i < cartItems.size(); i++) {
                JsonObject cartItem = cartItems.get(i).getAsJsonObject();
                String pName = cartItem.get("name").getAsString();
                String item = cartItem.get("item").getAsString();
                String qty = cartItem.get("qty").getAsString();
                
                outStockItemDetails = new JsonObject();
                outStockItemDetails.addProperty("name", pName);
                outStockItemDetails.addProperty("_id", item);
                outStockItemDetails.addProperty("quantity", qty);
                outStockCartItemArr.add(outStockItemDetails);
                
//                outStockItemDetails.addProperty("name", cartItem.get(i).getAsJsonObject().get("name").getAsString());
//                outStockItemDetails.addProperty("_id", cart.getAsJsonObject().get("item").getAsString());
//                outStockItemDetails.addProperty("quantity", cartItem.get(i).getAsJsonObject().get("qty").getAsString());
//                outStockCartItemArr.add(outStockItemDetails);
            }
        } else if (!data.get("status").getAsBoolean()) {
            for (int i = 0; i < cartItems.size(); i++) {
                JsonObject cartItem = cartItems.get(i).getAsJsonObject();
                JsonArray msg = data.get("messages").getAsJsonArray();
                itemDetails = new JsonObject();
                for (int j = 0; j < msg.size(); j++) {
                    JsonObject msgObj = msg.get(j).getAsJsonObject();
                    String outStockItemName = msgObj.get("item").getAsString();
                    
                    String pName = cartItem.get("name").getAsString();
                    String item = cartItem.get("item").getAsString();
                    int qty = cartItem.get("qty").getAsInt();
                    
                    itemDetails.addProperty("name", pName);
                    itemDetails.addProperty("_id", item);
                    
//                    itemDetails.addProperty("name", cartItem.get(i).getAsJsonObject().get("name").getAsString());
//                    itemDetails.addProperty("_id", cartItem.get(i).getAsJsonObject().get("item").getAsString());
                    if (pName.equals(outStockItemName)) {
                        String availableQty = cartItem.get("availableQty").getAsString();
                        
                        outStockItemDetails = new JsonObject();
                        outStockItemDetails.addProperty("name", pName);
                        outStockItemDetails.addProperty("_id", item);
                        outStockItemDetails.addProperty("quantity", (qty - Integer.parseInt(availableQty)));
                        
                        outStockCartItemArr.add(outStockItemDetails);
                        itemDetails.addProperty("quantity", availableQty);

                        
//                        itemDetails.addProperty("quantity", msgObj.get("availableQty").getAsString());
//                        outStockItemDetails.addProperty("name", cartItem.get(i).getAsJsonObject().get("name").getAsString());
//                        outStockItemDetails.addProperty("_id", cartItem.get(i).getAsJsonObject().get("item").getAsString());
//                        outStockItemDetails.addProperty("quantity", cartItem.get(i).getAsJsonObject().get("qty").getAsInt() - msgObj.get("availableQty").getAsInt());
//                        outStockCartItemArr.add(outStockItemDetails);
                    } else {
                        itemDetails.addProperty("quantity", qty + "");
//                        itemDetails.addProperty("quantity", cartItem.get(i).getAsJsonObject().get("qty").getAsString());
                    }
                    cartItemArr.add(itemDetails);
                }
            }
        } else {
            for (int i = 0; i < cartItems.size(); i++) {
                JsonObject cartItem = cartItems.get(i).getAsJsonObject();
                String pName = cartItem.get("name").getAsString();
                String item = cartItem.get("item").getAsString();
                String qty = cartItem.get("qty").getAsString();
                
                itemDetails = new JsonObject();
                itemDetails.addProperty("name", pName);
                itemDetails.addProperty("_id", item);
                itemDetails.addProperty("quantity", qty);
                cartItemArr.add(itemDetails);
//                itemDetails.addProperty("name", cartItem.get(i).getAsJsonObject().get("name").getAsString());
//                itemDetails.addProperty("_id", cartItem.get(i).getAsJsonObject().get("item").getAsString());
//                itemDetails.addProperty("quantity", cartItem.get(i).getAsJsonObject().get("qty").getAsString());
//                cartItemArr.add(itemDetails);
            }
        }

        if (cartItemArr.size() > 0 && shipNowOrder != null) {
            shipmentObj.add("shipment", cartItemArr);
            shipmentObj.addProperty("shipmentId", shipNowOrder.id);
            shipmentObj.addProperty("isShipped", true);
            shipmentObj.addProperty("availableToShipped", true);
            shipmentInfo.add(shipmentObj);
        }
        if (outStockCartItemArr.size() > 0 && shipLaterOrder != null) {
            shipmentObj.add("shipment", outStockCartItemArr);
            shipmentObj.addProperty("shipmentId", shipLaterOrder.id);
            shipmentObj.addProperty("isShipped", false);
            shipmentObj.addProperty("availableToShipped", false);
            shipmentInfo.add(shipmentObj);
        }
        return gson.toJson(shipmentInfo);
    }
}