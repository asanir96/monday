export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'
export const SET_IS_ADDING_BOARD = 'SET_IS_ADDING_BOARD'
export const SET_SIDEBAR_FILTER_BY = 'SET_SIDEBAR_FILTER_BY'

const initialState = {
    boards: [],
    board: null,
    isAddingBoard: false,
    sidebarFilterBy: {}
}

export function boardReducer(state = initialState, action) {
    var newState = state
    var boards
    switch (action.type) {
        case SET_IS_ADDING_BOARD:
            newState = { ...state, isAddingBoard: action.isAddingBoard }
            break
        case SET_SIDEBAR_FILTER_BY:
            newState = { ...state, sidebarFilterBy: action.sidebarFilterBy }
            break
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break
        case SET_BOARD:
            newState = { ...state, board: action.board }
            break
        case REMOVE_BOARD:
            const lastRemovedboard = state.boards.find(board => board._id === action.boardId)
            boards = state.boards.filter(board => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedboard }
            break
        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case UPDATE_BOARD:
            boards = state.boards.map(board => (board._id === action.board._id) ? action.board : board)
            // Also refresh the open board, otherwise BoardDetails keeps showing the old one
            const board = (state.board?._id === action.board._id) ? action.board : state.board
            newState = { ...state, boards, board }
            break
        case ADD_BOARD_MSG:
            if (action.msg && state.board) {
                newState = { ...state, board: { ...state.board, msgs: [...state.board.msgs || [], action.msg] } }
                break
            }
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const board1 = { _id: 'b101', vendor: 'board ' + parseInt('' + Math.random() * 10), speed: 12, owner: null, msgs: [] }
    const board2 = { _id: 'b102', vendor: 'board ' + parseInt('' + Math.random() * 10), speed: 13, owner: null, msgs: [] }

    state = boardReducer(state, { type: SET_BOARDS, boards: [board1] })
    console.log('After SET_boardS:', state)

    state = boardReducer(state, { type: ADD_board, board: board2 })
    console.log('After ADD_board:', state)

    state = boardReducer(state, { type: UPDATE_board, board: { ...board2, vendor: 'Good' } })
    console.log('After UPDATE_board:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board2._id })
    console.log('After REMOVE_board:', state)

    state = boardReducer(state, { type: SET_BOARD, board: board1 })
    console.log('After SET_board:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some msg', by: { _id: 'u123', fullname: 'test' } }
    state = boardReducer(state, { type: ADD_board_MSG, boardId: board1._id, msg })
    console.log('After ADD_board_MSG:', state)
}

