// Импорт классов Grid и Tile из соответствующих файлов
import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

// Получение элемента игровой доски по id
const gameBoard = document.getElementById("game-board");

// Создание экземпляра класса Grid и его инициализация
const grid = new Grid(gameBoard);

// Установка двух новых плиток на случайные пустые ячейки
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

// Установка обработчика событий для нажатия клавиш с опцией {once: true}
setupInputOnce();

// Определение функции для настройки обработчика событий
function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
}

// Асинхронная функция обработки нажатия клавиш
async function handleInput(event) {
  // Переключатель для обработки различных клавиш
  switch (event.key) {
    case "ArrowUp":
      // Обработка нажатия клавиши вверх
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      // Обработка нажатия клавиши вниз
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      // Обработка нажатия клавиши влево
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      // Обработка нажатия клавиши вправо
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    default:
      setupInputOnce();
      return;
  }

  // Создание новой плитки и расположение ее в случайной пустой ячейке
  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  // Проверка на возможность выполнения дальнейших ходов
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    alert("Try again!");
    return;
  }

  setupInputOnce();
}

// Функции для движения плиток в различные направления
async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

// Асинхронная функция для перемещения плиток в группах
async function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  await Promise.all(promises);
  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

// Функция для перемещения плиток внутри группы
function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

// Функции для проверки возможности движения в различных направлениях
function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

// Общая функция для проверки возможности движения в группе ячеек
function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

// Функция для проверки возможности движения внутри группы ячеек
function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}