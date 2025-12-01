<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.web.AreaCheckServlet.PointResult" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Результат проверки</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1>Результат проверки попадания точки</h1>
                <p>Студент: Кузнецов Матвей Сергеевич</p>
                <p>Группа: P3223</p>
                <p>Вариант: 2747</p>
            </div>
        </div>
    </header>

    <main class="container">
        <div class="result-container">
            <%
                PointResult pointResult = (PointResult) request.getAttribute("pointResult");
                if (pointResult != null) {
            %>
            <div class="result-card <%= pointResult.isResult() ? "hit" : "miss" %>">
                <h2 class="result-title">Результат проверки координат</h2>
                
                <div class="result-grid">
                    <div class="result-item">
                        <span class="result-label">X</span>
                        <span class="result-value"><%= pointResult.getX() %></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Y</span>
                        <span class="result-value"><%= pointResult.getY() %></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">R</span>
                        <span class="result-value"><%= pointResult.getR() %></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Время</span>
                        <span class="result-value" style="font-size: 1rem;"><%= pointResult.getCurrentTime() %></span>
                    </div>
                </div>
                
                <div class="result-status <%= pointResult.isResult() ? "hit" : "miss" %>">
                    <%= pointResult.isResult() ? "Точка попадает в область" : "Точка не попадает в область" %>
                </div>
            </div>
            <% } else { %>
            <div class="error-message">
                <h2 class="error-title">Ошибка</h2>
                <p class="error-text">Не удалось получить данные о проверяемой точке.</p>
                <p class="error-text">Пожалуйста, вернитесь на главную страницу и попробуйте снова.</p>
            </div>
            <% } %>
            
            <div class="button-group">
                <a href="controller" class="btn btn-primary">Вернуться к форме ввода</a>
                <a href="controller?clear=true" class="btn btn-danger">Очистить историю</a>
            </div>
        </div>
    </main>
</body>
</html>