import { boardService } from '../../services/board'
import { moveItem } from '../../services/util.service'
import { store } from '../store'
import {
    ADD_BOARD,
    REMOVE_BOARD,
    SET_BOARDS,
    SET_BOARD,
    UPDATE_BOARD,
    SET_IS_ADDING_BOARD,
    SET_SIDEBAR_VIEW
} from '../reducers/board.reducer'

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

export async function setSidebarView(view) {
    try {
        store.dispatch(getCmdSetSidebarView(view))
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

// ---- Group & task CRUD ----
// All of these work on the open board (boardModule.board): build an updated copy
// of the board and hand it to updateBoardOptimistic (instant UI, save in background, rollback on error).

export function addGroup(group = boardService.getEmptyGroup()) {
    const board = _getOpenBoard()
    return updateBoardOptimistic({ ...board, groups: [...board.groups, group] })
}

export function updateGroup(groupToSave) {
    const board = _getOpenBoard()
    const groups = board.groups.map(group => group.id === groupToSave.id ? groupToSave : group)
    return updateBoardOptimistic({ ...board, groups })
}

export function removeGroup(groupId) {
    const board = _getOpenBoard()
    const groups = board.groups.filter(group => group.id !== groupId)
    return updateBoardOptimistic({ ...board, groups })
}

export function addTask(groupId, task = boardService.getEmptyTask()) {
    return _updateGroupTasks(groupId, tasks => [...tasks, task])
}

export function updateTask(groupId, taskToSave) {
    return _updateGroupTasks(groupId, tasks => tasks.map(task => task.id === taskToSave.id ? taskToSave : task))
}

export function removeTask(groupId, taskId) {
    return _updateGroupTasks(groupId, tasks => tasks.filter(task => task.id !== taskId))
}

// ---- Drag and drop ----

// Moves a group from one place in the list to another (indexes in board.groups)
export function moveGroup(fromIdx, toIdx) {
    const board = _getOpenBoard()
    return updateBoardOptimistic({ ...board, groups: moveItem(board.groups, fromIdx, toIdx) })
}

// Moves a task inside its group or into another group:
// moveTask({ groupId: 'g101', idx: 0 }, { groupId: 'g102', idx: 3 })
export function moveTask(from, to) {
    if (from.groupId === to.groupId) {
        return _updateGroupTasks(from.groupId, tasks => moveItem(tasks, from.idx, to.idx))
    }

    // Between groups: take it out of one, put it into the other
    const board = _getOpenBoard()
    const task = board.groups.find(group => group.id === from.groupId).tasks[from.idx]
    const groups = board.groups.map(group => {
        if (group.id === from.groupId) return { ...group, tasks: group.tasks.filter((_, idx) => idx !== from.idx) }
        if (group.id === to.groupId) return { ...group, tasks: group.tasks.toSpliced(to.idx, 0, task) }
        return group
    })
    return updateBoardOptimistic({ ...board, groups })
}

// Replaces one group's tasks array, using the given function to build the new array
function _updateGroupTasks(groupId, updateTasks) {
    const board = _getOpenBoard()
    const groups = board.groups.map(group =>
        group.id === groupId ? { ...group, tasks: updateTasks(group.tasks) } : group
    )
    return updateBoardOptimistic({ ...board, groups })
}

function _getOpenBoard() {
    const board = store.getState().boardModule.board
    if (!board) throw new Error('No board is open')
    return board
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

function getCmdSetSidebarView(view) {
    return {
        type: SET_SIDEBAR_VIEW,
        sidebarView: view
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
