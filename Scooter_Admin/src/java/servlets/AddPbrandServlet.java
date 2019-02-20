package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import common.Global;
import controller.RefererCheckManager;
import controller.SNServer;
import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.apache.commons.io.IOUtils;
import org.apache.tomcat.util.codec.binary.Base64;

@MultipartConfig
@WebServlet(name = "AddPbrandServlet", urlPatterns = {"/addPbrand"})
public class AddPbrandServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "addProduct.jsp", "updateProduct.jsp", "addPbrand.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        String pbrand = request.getParameter("pbrand");
        String tier1Discount = request.getParameter("t1bd");
        String tier2Discount = request.getParameter("t2bd");
        String tier3Discount = request.getParameter("t3bd");
        String tier4Discount = request.getParameter("t4bd");
        Part imagePart = request.getPart("pbrandImage");
        
        if (pbrand == null || pbrand.trim().isEmpty()) {
            JsonObject error = new JsonObject();
            error.addProperty("status", false);
            error.addProperty("message", "Product Brand name is required!");
            response.getWriter().println(new Gson().toJson(error));
            return;
        }
        
        if (tier1Discount == null || tier1Discount.trim().isEmpty()) {
            tier1Discount = "0";
        }
        if (tier2Discount == null || tier2Discount.trim().isEmpty()) {
            tier2Discount = "0";
        }
        if (tier3Discount == null || tier3Discount.trim().isEmpty()) {
            tier3Discount = "0";
        }
        if (tier4Discount == null || tier4Discount.trim().isEmpty()) {
            tier4Discount = "0";
        }
        
        String POST_URL = Global.BASE_URL + "/addProductBrand";
        String POST_PARAMS = "name=" + pbrand + "&tier1discountrate=" + tier1Discount + "&tier2discountrate=" + tier2Discount + "&tier3discountrate=" + tier3Discount
                + "&tier4discountrate=" + tier4Discount;
        
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        boolean status = obj.get("status").getAsBoolean();
        if (status) {
            JsonObject data = obj.get("data").getAsJsonObject();
            if (imagePart != null && imagePart.getSubmittedFileName() != null) {
                String id = data.get("_id").getAsString();
                String finalStatus = uploadImage(imagePart, request, response, id);
                if (!finalStatus.equals("")) {
                    JsonObject error = new JsonObject();
                    error.addProperty("status", false);
                    error.addProperty("message", finalStatus);
                    response.getWriter().println(new Gson().toJson(error));
                    return;
                }
            }
        }
        response.getWriter().println(new Gson().toJson(obj));
    }
    
    private String uploadImage(Part imagePart, HttpServletRequest request,
            HttpServletResponse response, String id) throws IOException {
        List<String> tempStorage = new ArrayList<>();
        String tempName = "temp";
        
        InputStream filecontent = imagePart.getInputStream();
        String imageContentType = imagePart.getContentType();
        String fileName = tempName + "1." + (imageContentType.split("/")[1]);
        tempStorage.add(fileName);

        processWatermark(fileName, filecontent);

        String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;
        File outputFile = new File(systempath + fileName);

        InputStream targetStream = new FileInputStream(outputFile);

        String imageType = imageContentType.substring(imageContentType.indexOf("/") + 1);
        byte b[] = IOUtils.toByteArray(targetStream);
        byte[] encodeBase64 = Base64.encodeBase64(b);
        String base64DataString = new String(encodeBase64, "UTF-8");
        String temp = base64DataString.replaceAll("\\+", "%2B");

        String POST_URL = Global.BASE_URL + "/addProductBrandImage";
        String POST_PARAMS = "pbId=" + id + "&pbImage=" + temp + "&fileType=" + imageType;
        String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
        JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
        
        removeAllAddedTempFiles(tempStorage);
        
        boolean status = obj.get("status").getAsBoolean();
        if (!status) {
            String message = obj.get("message").getAsString();
            return message;
        }
        return "";
    }
    
    void processWatermark(String fileName, InputStream filecontent) throws IOException {
        String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;;

        // Indicate watermark file location
        File overlay = new File(systempath + "SN_Watermark.png");

        File input = new File(systempath + fileName);

        // Create original uploaded file into img folder
        OutputStream outStream = new FileOutputStream(input);
        byte[] buffer = new byte[8 * 1024];
        int bytesRead;
        while ((bytesRead = filecontent.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }

        // Indicate final watermarked included image location
        File outputFile = new File(systempath + fileName);
        addImageWatermark(overlay, input, outputFile);
    }
    
    void addImageWatermark(File watermarkImageFile, File sourceImageFile, File destImageFile) {
        try {
            BufferedImage sourceImage = ImageIO.read(sourceImageFile);
            BufferedImage watermarkImage = ImageIO.read(watermarkImageFile);

            // initializes necessary graphic properties
            Graphics2D g2d = (Graphics2D) sourceImage.getGraphics();
            AlphaComposite alphaChannel = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f);
            g2d.setComposite(alphaChannel);

            // calculates the coordinate where the image is painted
            int topLeftX = (sourceImage.getWidth() - watermarkImage.getWidth()) / 2;
            int topLeftY = (sourceImage.getHeight() - watermarkImage.getHeight()) / 2;

            // paints the image watermark
            g2d.drawImage(watermarkImage, topLeftX, topLeftY, null);

            ImageIO.write(sourceImage, "png", destImageFile);
            g2d.dispose();

            System.out.println("The image watermark is added to the image.");

        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
    
    void removeAllAddedTempFiles(List<String> fileNames) throws IOException {
        String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;;
        for (String fileName : fileNames) {
            File file = new File(systempath + fileName);
            file.delete();
        }
    }
}
