export class Tile {
  // Конструктор класса Tile
  constructor(gridElement) {
    // Создание элемента плитки и добавление класса "tile"
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    // Установка значения плитки (2 или 4)
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    // Добавление элемента плитки на игровую доску
    gridElement.append(this.tileElement);
  }

  // Метод для установки значения плитки
  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    // Вычисление цвета фона и текста плитки в зависимости от значения
    const bgLightness = 100 - Math.log2(value) * 9;
    this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`);
    this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`);
  }

  // Метод для установки координат плитки
  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty("--x", x);
    this.tileElement.style.setProperty("--y", y);
  }

  // Метод для удаления плитки из DOM
  removeFromDOM() {
    this.tileElement.remove();
  }

  // Метод для ожидания завершения перехода (transition) плитки
  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        "transitionend", resolve, { once: true });
    });
  }

  // Метод для ожидания завершения анимации плитки
  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        "animationend", resolve, { once: true });
    });
  }
}