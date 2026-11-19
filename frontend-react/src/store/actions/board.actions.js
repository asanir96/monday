import { boardService } from '../../services/board'
import { store } from '../store'
import { ADD_BOARD, REMOVE_BOARD, SET_BOARDS, SET_BOARD, UPDATE_BOARD, SET_IS_ADDING_BOARD } from '../reducers/board.reducer'

export async function loadBoards(filterBy) {
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch(getCmdSetBoards(boards))
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch(getCmdSetBoard(board))
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}


export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch(getCmdRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function addBoard(board) {
    try {
        store.dispatch(getCmdSetIsAddingBoard(true))
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot add car', err)
        throw err
    } finally {
        store.dispatch(getCmdSetIsAddingBoard(false))

    }
}

export async function updateBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

// Optimistic update: the store changes immediately, the save happens in the background.
// If the save fails, the store goes back to the previous version and the error is rethrown.
export async function updateBoardOptimistic(board) {
    const { board: openBoard, boards } = store.getState().boardModule
    const prevBoard = (openBoard?._id === board._id)
        ? openBoard
        : boards.find(b => b._id === board._id)

    // Runs before the first await, so the screen updates in the same tick
    store.dispatch(getCmdUpdateBoard(board))
    try {
        // Not dispatching the saved board: a slow response would overwrite a newer change
        return await boardService.save(board)
    } catch (err) {
        console.log('Cannot save board, rolling back', err)
        if (prevBoard) store.dispatch(getCmdUpdateBoard(prevBoard))
        throw err
    }
}

// Command Creators:
function getCmdSetBoards(boards) {
    return {
        type: SET_BOARDS,
        boards
    }
}
function getCmdSetBoard(board) {
    return {
        type: SET_BOARD,
        board
    }
}
function getCmdRemoveBoard(boardId) {
    return {
        type: REMOVE_BOARD,
        boardId
    }
}
function getCmdAddBoard(board) {
    return {
        type: ADD_BOARD,
        board
    }
}
function getCmdUpdateBoard(board) {
    return {
        type: UPDATE_BOARD,
        board
    }
}

function getCmdSetIsAddingBoard(state) {
    return {
        type: SET_IS_ADDING_BOARD,
        isAddingBoard: state
    }
}


// unitTestActions()
async function unitTestActions() {
    await loadBoards()
    await addCar(boardService.getEmptyCar())
    await updateCar({
        _id: 'm1oC7',
        vendor: 'Car-Good',
    })
    await removeCar('m1oC7')
    // TODO unit test addCarMsg
}
