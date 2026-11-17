
import { storageService } from '../async-storage.service'
import { getEmptyBoard } from '.'
import { makeId } from '../util.service'
import { userService } from '../user'
import demoBoards from '../../assets/data/board.json'

const STORAGE_KEY = 'board'
_createBoards()

export const boardService = {
    query,
    getById,
    save,
    remove,
    addCarMsg
}
window.bs = boardService


async function query() {
    var boards = await storageService.query(STORAGE_KEY)
    return boards
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
    } else {
        savedBoard = await storageService.post(STORAGE_KEY, board)
    }
    return savedBoard
}

async function updateBoard(){

}

async function addCarMsg(carId, txt) {
    // Later, this is all done by the backend
    const car = await getById(carId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    car.msgs.push(msg)
    await storageService.put(STORAGE_KEY, car)

    return msg
}

function _createBoards() {
    const boards = localStorage.getItem(STORAGE_KEY)
    if (!boards || !boards.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoBoards))
    }
}