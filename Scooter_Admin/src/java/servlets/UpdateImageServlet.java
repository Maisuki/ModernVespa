package servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
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
import org.apache.tomcat.util.http.fileupload.util.Streams;

@MultipartConfig
@WebServlet(name = "UpdateImageServlet", urlPatterns = {"/updateImage"})
public class UpdateImageServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String referer = request.getHeader("Referer");
        
        if (referer == null) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        if (!RefererCheckManager.refererCheck(referer, "updateProductImage.jsp")) {
            response.getWriter().println("Unauthorized access!");
            return;
        }
        
        List<Part> list = new ArrayList<>(request.getParts());
        InputStream stream = list.get(0).getInputStream();
        String value = Streams.asString(stream);
        
        String productId = "";
        ArrayList<Part> imagePartList = new ArrayList<>();
        
        for (Part filePart : list) {
            if (filePart.getContentType() == null) {
                if (filePart.getName().equals("pid")) {
                    productId = Streams.asString(filePart.getInputStream());
                }
                continue;
            }
            if (!filePart.getSubmittedFileName().isEmpty()) {
                imagePartList.add(filePart);
            }
        }
        
        uploadImage(imagePartList, request, response, productId);
    }

    private void uploadImage(ArrayList<Part> imagePartList, HttpServletRequest request,
            HttpServletResponse response, String id) throws IOException {
        ArrayList<String> imgList = new ArrayList<>();
        List<String> tempStorage = new ArrayList<>();
        InputStream filecontent = null;
        try {
            List<String> imageType = new ArrayList<>();
            List<String> imageList = new ArrayList<>();
            int i = 0;
            int index = 0;
            String tempName = "temp";

            for (Part imagePart : imagePartList) {
                filecontent = imagePart.getInputStream();
                String imageContentType = imagePart.getContentType();
                String fileName = tempName + (++index) + "." + (imageContentType.split("/")[1]);
                tempStorage.add(fileName);

                processWatermark(fileName, filecontent);

                String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;
                File outputFile = new File(systempath + fileName);

                InputStream targetStream = new FileInputStream(outputFile);

                imageType.add(imageContentType.substring(imageContentType.indexOf("/") + 1));
                byte b[] = IOUtils.toByteArray(targetStream);
                byte[] encodeBase64 = Base64.encodeBase64(b);
                String base64DataString = new String(encodeBase64, "UTF-8");
                String temp = base64DataString.replaceAll("\\+", "%2B");
                imgList.add(temp);
            }
            int j = 0;
            JsonArray imageJsonArr = new JsonArray();
            for (String img : imgList) {
                String POST_URL = Global.BASE_URL + "/addProductPhase3";
                String POST_PARAMS = "pId=" + id + "&productImage=" + img + "&fileType=" + imageType.get(j++);
                String result = SNServer.sendPOST(POST_URL, POST_PARAMS);
                JsonObject obj = new JsonParser().parse(result).getAsJsonObject();
                boolean status = obj.get("status").getAsBoolean();
                if (!status) {
                    String message = obj.get("message").getAsString();
                    request.setAttribute("message", message);
                    return;
                }
            }
            removeAllAddedTempFiles(tempStorage);
            String url = "updateProductImage.jsp?pid=" + id;
            response.sendRedirect(url);
        } catch (JsonSyntaxException | IOException e) {
            String url = "updateProductImage.jsp?pid=" + id;
            response.sendRedirect(url);
        } finally {
            if (filecontent != null) {
                filecontent.close();
            }
        }
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

    void removeAllAddedTempFiles(List<String> fileNames) throws IOException {
        String systempath = getServletContext().getRealPath("") + File.separator + "img" + File.separator;;
        for (String fileName : fileNames) {
            File file = new File(systempath + fileName);
            file.delete();
        }
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
}
