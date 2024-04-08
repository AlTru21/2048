// Класс ячейки, представляющий ячейку игрового поля
export class Cell {
  // Конструктор класса
  constructor(gridElement, x, y) {
    // Создаем элемент ячейки
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gridElement.append(cell);
    this.x = x; // Устанавливаем координату x
    this.y = y; // Устанавливаем координату y
  }

  // Связать ячейку с плиткой
  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  // Разорвать связь с плиткой
  unlinkTile() {
    this.linkedTile = null;
  }

  // Проверить, пуста ли ячейка
  isEmpty() {
    return !this.linkedTile;
  }

  // Связать ячейку с плиткой для объединения
  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  // Разорвать связь с плиткой для объединения
  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  // Проверить, есть ли плитка для объединения
  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  // Проверить, может ли ячейка принять новую плитку
  canAccept(newTile) {
    return (
      this.isEmpty() ||
      (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }

  // Объединение плиток в ячейке
  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }
}