package com.web;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String r = request.getParameter("r");
        String clear = request.getParameter("clear");
        String x_select = request.getParameter("x_select");
        
        System.out.println("DEBUG: x=" + x + ", y=" + y + ", r=" + r + ", x_select=" + x_select);
        
        if (clear != null && clear.equals("true")) {
            request.getRequestDispatcher("/area-check").forward(request, response);
        } else if ((x != null && !x.trim().isEmpty()) || (x_select != null && !x_select.trim().isEmpty())) {
            request.getRequestDispatcher("/area-check").forward(request, response);
        } else {
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}