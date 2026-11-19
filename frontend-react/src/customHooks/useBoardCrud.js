import { addBoard, removeBoard, updateBoardOptimistic } from "../store/actions/board.actions"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function useBoardCrud() {
    const navigate = useNavigate()
    const openBoardId = useSelector(s => s.boardModule.board?._id)

    async function onAddEmptyBoard() {
        try {
            const emptyBoard = boardService.getEmptyBoard()
            const addedBoard = await addBoard(emptyBoard)
            showSuccessMsg('Board added')
        } catch(err){
            console.log(err)
            showErrorMsg('Could not add board')
        }

    }

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            if (boardId === openBoardId) navigate('/board')
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


    return { onRemoveBoard, onUpdateBoard,onAddEmptyBoard  }
}
