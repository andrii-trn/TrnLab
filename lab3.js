// Ця функція призначена для запуску на сторінці з метеоданими
function findHottestDay() {
    // Отримуємо всі рядки таблиці
    var rows = document.querySelectorAll('table tr');
    
    var maxTemp = -Infinity; // Початкове дуже низьке значення
    var hottestDate = 'Не знайдено';

    // Проходимо по всіх рядках, починаючи з 1 (пропускаємо заголовок 0)
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].cells;

        // Перевіряємо, чи достатньо комірок у рядку (щоб уникнути помилок)
        if (cells.length > 3) {
            // Згідно зі скріншотом:
            // Індекс 2 - це DATE_OBS (Дата)
            // Індекс 3 - це TMPMAX (Максимальна температура)
            var dateText = cells[2].innerText.trim();
            var tempText = cells[3].innerText.trim();
            
            // Перетворюємо текст температури на число
            var temp = parseFloat(tempText);

            // Якщо це число і воно більше за поточний максимум
            if (!isNaN(temp) && temp > maxTemp) {
                maxTemp = temp;
                hottestDate = dateText;
            }
        }
    }

    // Виводимо результат
    alert('Результат аналізу:\n\nНайспекотніший день: ' + hottestDate + '\nТемпература: ' + maxTemp + ' °C');
}

findHottestDay();