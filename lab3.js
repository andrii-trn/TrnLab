(function () {
  const t = document.querySelector("table");
  if (!t) {
    alert("Таблицю не знайдено");
    return;
  }

  const rows = t.rows;
  if (!rows || rows.length < 2) {
    alert("Недостатньо даних у таблиці");
    return;
  }

  const heads = Array.from(rows[0].cells, (c) =>
    c.textContent.trim().toUpperCase()
  );

  const iDate = heads.indexOf("DATE_OBS");
  const iMax = heads.indexOf("TMPMAX");

  if (iDate < 0 || iMax < 0) {
    alert("Не знайдено колонки DATE_OBS або TMPMAX");
    return;
  }

  let bestTemp = -Infinity;
  let bestDate = "";
  let bestRow = null;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].cells;
    if (!cells || cells.length <= Math.max(iDate, iMax)) continue;

    const date = (cells[iDate].textContent || "").trim();
    const tempText = (cells[iMax].textContent || "")
      .trim()
      .replace(",", ".");
    const temp = parseFloat(tempText);

    if (!date || Number.isNaN(temp)) continue;

    if (temp > bestTemp) {
      bestTemp = temp;
      bestDate = date;
      bestRow = rows[i];
    }
  }

  if (!bestRow) {
    alert("Не знайдено валідних значень TMPMAX");
    return;
  }

  for (let r = 1; r < rows.length; r++) {
    rows[r].style.background = "";
  }
  bestRow.style.background = "#fff3a0";

  let box = document.getElementById("hot-day-result");
  if (!box) {
    box = document.createElement("div");
    box.id = "hot-day-result";
    document.body.appendChild(box);
  }

  box.style.cssText = [
    "position:fixed",
    "right:12px",
    "bottom:12px",
    "z-index:999999",
    "background:#111",
    "color:#fff",
    "padding:10px 12px",
    "border-radius:10px",
    "font:14px Arial",
    "max-width:280px",
    "box-shadow:0 4px 14px rgba(0,0,0,.25)",
  ].join(";");

  box.textContent = `Найспекотніший день: ${bestDate} (TMPMAX: ${bestTemp}°C)`;
})();
