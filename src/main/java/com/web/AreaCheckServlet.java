package com.web;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;

@WebServlet("/area-check")
public class AreaCheckServlet extends HttpServlet {

    private static final double[] VALID_R = { 1, 2, 3, 4, 5 };

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            if ("true".equals(request.getParameter("clear"))) {
                clearHistory(request);
                response.sendRedirect("controller");
                return;
            }

            double x = getXParameter(request);
            double y = getYParameter(request);
            double r = getRParameter(request);

            System.out.println("DEBUG: Checking point x=" + x + ", y=" + y + ", r=" + r);

            if (!isValidR(r)) {
                throw new IllegalArgumentException("R must be one of: 1, 2, 3, 4, 5");
            }

            boolean result = checkArea(x, y, r);
            String currentTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

            PointResult pointResult = new PointResult(x, y, r, result, currentTime);

            HttpSession session = request.getSession();
            LinkedList<PointResult> results = (LinkedList<PointResult>) session.getAttribute("results");
            if (results == null) {
                results = new LinkedList<>();
            }
            results.addFirst(pointResult);
            if (results.size() > 50) {
                results.removeLast();
            }
            session.setAttribute("results", results);

            request.setAttribute("pointResult", pointResult);
            request.getRequestDispatcher("/result.jsp").forward(request, response);

        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error: " + e.getMessage());
        }
    }

    private double getXParameter(HttpServletRequest request) {
        String x = request.getParameter("x"); 
        String x_select = request.getParameter("x_select"); 

        if (x != null && !x.trim().isEmpty()) {
            return Double.parseDouble(x.trim());
        } else if (x_select != null && !x_select.trim().isEmpty()) {
            return Double.parseDouble(x_select.trim());
        } else {
            throw new IllegalArgumentException("X coordinate is required");
        }
    }

    private double getYParameter(HttpServletRequest request) {
        String y = request.getParameter("y");
        if (y == null || y.trim().isEmpty()) {
            throw new IllegalArgumentException("Y coordinate is required");
        }
        double yValue = Double.parseDouble(y.trim());
        if (yValue < -5 || yValue > 3) {
            throw new IllegalArgumentException("Y must be between -5 and 3");
        }
        return yValue;
    }

    private double getRParameter(HttpServletRequest request) {
        String r = request.getParameter("r");
        if (r == null || r.trim().isEmpty()) {
            throw new IllegalArgumentException("R parameter is required");
        }
        return Double.parseDouble(r.trim());
    }

    private void clearHistory(HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.removeAttribute("results");
    }

    private boolean isValidR(double r) {
        for (double valid : VALID_R) {
            if (Math.abs(r - valid) < 0.000001)
                return true;
        }
        return false;
    }

    private boolean checkArea(double x, double y, double r) {
        if (x == 0.0 && y == 0.0)
            return r != 0.0;

        if (x >= 0 && y >= 0) { 
            return y <= -2.0 * x + r; 
        } else if (x <= 0 && y >= 0) { 
            return x * x + y * y <= (r / 2) * (r / 2); 
        } else if (x <= 0 && y <= 0) { 
            return (x >= -r / 2) && (y >= -r); 
        } else { 
            return false;
        }
    }

    public static class PointResult {
        private double x;
        private double y;
        private double r;
        private boolean result;
        private String currentTime;

        public PointResult(double x, double y, double r, boolean result, String currentTime) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.result = result;
            this.currentTime = currentTime;
        }

        public double getX() {
            return x;
        }

        public double getY() {
            return y;
        }

        public double getR() {
            return r;
        }

        public boolean isResult() {
            return result;
        }

        public String getCurrentTime() {
            return currentTime;
        }
    }
}