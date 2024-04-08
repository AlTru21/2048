// Класс представляющий игровое поле
import { Cell } from "./cell.js"; // Импорт класса Cell

const GRID_SIZE = 4; // Размер игрового поля
const CELLS_COUNT = GRID_SIZE * GRID_SIZE; // Общее количество ячеек на поле

export class Grid {
  constructor(gridElement) {
    this.cells = []; // Массив ячеек игрового поля
    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE)) // Создание и добавление ячейки в массив cells
      );
    }

    // Группировка ячеек по столбцам
    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
    
    // Группировка ячеек по строкам
    this.cellsGroupedByRow = this.groupCellsByRow();
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(row => [...row].reverse());
  }

  // Получение случайной пустой ячейки
  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Группировка ячеек по столбцам
  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, []);
  }

  // Группировка ячеек по строкам
  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []);
  }
}