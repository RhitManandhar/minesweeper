//Display UI
//Populate a board with tiles/miles
//Left click on tile>reveal tile
//right click on tile>mark tile
//check for win/lose
import {
  createBoard,
  markTile,
  revealTile,
  checkLose,
  checkWin,
} from "./minesweeper.js"
import { TILE_STATUS } from "./minesweeper.js"

const BOARD_SIZE = 4
const NUMBER_OF_MINES = 2

const minesLeft = document.querySelector("[data-mine-count]")
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const message = document.querySelector(".subtext")

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})

boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeft.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUS.MARKED).length
    )
  }, 0)

  minesLeft.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)
  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }
  if (win) {
    message.textContent = "You win"
  }
  if (lose) {
    message.textContent = "You lose"
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUS.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}
function stopProp(e) {
  e.stopImmediatePropagation()
}
