<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.LinkedList" %>
<%@ page import="com.web.AreaCheckServlet.PointResult" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Проверка попадания точки в область</title>
    <link rel="stylesheet" href="styles.css">
    <script src="graf.js"></script>
    <script src="main.js"></script>
    <script src="script.js"></script>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1>Лабораторная работа по веб-программированию</h1>
                <p>Студент: Кузнецов Матвей Сергеевич</p>
                <p>Группа: P3223</p>
                <p>Вариант: 2747</p>
            </div>
        </div>
    </header>

    <main class="container">
        <div class="main-grid">
            <section class="card">
                <h2 class="card-title">Введите параметры</h2>
                <form id="pointForm" action="controller" method="GET">
                    <input type="hidden" id="graph-x" name="x">
                    
                    <div class="form-group">
                        <label class="form-label" for="x-select">Координата X</label>
                        <select class="form-select" id="x-select" name="x_select" required>
                            <option value="-4">-4</option>
                            <option value="-3">-3</option>
                            <option value="-2">-2</option>
                            <option value="-1">-1</option>
                            <option value="0" selected>0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="y-input">Координата Y</label>
                        <input class="form-input" type="text" id="y-input" name="y" placeholder="от -5 до 3" required>
                        <small style="color: var(--gray); font-size: 0.875rem; display: block; margin-top: 0.25rem;">
                            Число от -5 до 3
                        </small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Радиус R</label>
                        <div class="radio-group">
                            <input type="radio" name="r" value="1" id="r1" class="radio-input" required>
                            <label for="r1" class="radio-label">1</label>
                            <input type="radio" name="r" value="2" id="r2" class="radio-input" checked>
                            <label for="r2" class="radio-label">2</label>
                            <input type="radio" name="r" value="3" id="r3" class="radio-input">
                            <label for="r3" class="radio-label">3</label>
                            <input type="radio" name="r" value="4" id="r4" class="radio-input">
                            <label for="r4" class="radio-label">4</label>
                            <input type="radio" name="r" value="5" id="r5" class="radio-input">
                            <label for="r5" class="radio-label">5</label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Проверить точку</button>
                    <button type="button" class="btn btn-danger" id="clearBtn">Очистить историю</button>
                </form>
            </section>

            <section class="card">
                <h2 class="card-title">Результаты проверки</h2>
                
                <div class="graph-container">
                    <canvas id="graf" width="500" height="500"></canvas>
                </div>
                <script>
                    window.results = [
                        <%
                            LinkedList<PointResult> results = (LinkedList<PointResult>) session.getAttribute("results");
                            if (results != null) {
                                for (int i = 0; i < results.size(); i++) {
                                    PointResult point = results.get(i);
                        %>
                        { x: <%= point.getX() %>, y: <%= point.getY() %>, r: <%= point.getR() %>, result: <%= point.isResult() %> }<%= (i < results.size() - 1) ? "," : "" %>
                        <%
                                }
                            }
                        %>
                    ];
                </script>
                
                <div class="history-section">
                    <h3 class="history-title">История проверок</h3>
                    <div class="table-container">
                        <table class="results-table">
                            <thead>
                                <tr>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>R</th>
                                    <th>Результат</th>
                                    <th>Время запроса</th>
                                </tr>
                            </thead>
                            <tbody>
                                <%
                                    if (results != null) {
                                        for (PointResult point : results) {
                                %>
                                    <tr>
                                        <td><%= point.getX() %></td>
                                        <td><%= point.getY() %></td>
                                        <td><%= point.getR() %></td>
                                        <td>
                                            <span class="<%= point.isResult() ? "status-hit" : "status-miss" %>">
                                                <%= point.isResult() ? "Попадание" : "Непопадание" %>
                                            </span>
                                        </td>
                                        <td><%= point.getCurrentTime() %></td>
                                    </tr>
                                <%
                                        }
                                    }
                                %>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    </main>

    
</body>
</html>