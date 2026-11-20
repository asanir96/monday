import { addBoard, removeBoard, updateBoardOptimistic, setSidebarView } from "../store/actions/board.actions"
import { boardService } from "../services/board"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function useBoardCrud() {
    const navigate = useNavigate()
    const openBoardId = useSelector(s => s.boardModule.board?._id)
    const view = useSelector(s => s.boardModule.sidebarView)
    const boards = useSelector(s => s.boardModule.boards)
    const filteredBoards = boardService.filterBoardsByView(boards, view)

    async function onAddEmptyBoard() {
        try {
            const emptyBoard = boardService.getEmptyBoard()
            const addedBoard = await addBoard(emptyBoard)
            showSuccessMsg('Board added')
        } catch (err) {
            console.log(err)
            showErrorMsg('Could not add board')
        }

    }

    async function onRemoveBoard(boardId) {
        try {
            const boardIdx = filteredBoards.findIndex(board => board._id === boardId)
            const prevBoard = filteredBoards[boardIdx - 1]
            await removeBoard(boardId)

            if (!prevBoard) {
                setSidebarView('workspace')
                navigate(`/board`)
            } else if (boardId === openBoardId && prevBoard._id) {
                navigate(`/board/${prevBoard._id}`)
            }

            showSuccessMsg('Board removed')
        } catch (err) {
            showErrorMsg('Could not remove board')
        }
    }

    async function onUpdateBoard(board) {
        try {
            await updateBoardOptimistic(board)
            showSuccessMsg('Board updated')
        } catch (err) {
            showErrorMsg('Could not upadate board')
        }
    }


    return { onRemoveBoard, onUpdateBoard, onAddEmptyBoard }
}
