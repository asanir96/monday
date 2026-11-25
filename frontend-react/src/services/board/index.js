const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'
import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

export function getEmptyBoard() {
    return {
        title: 'New Board',
        isStarred: false,
        archivedAt: null,
        style: {
            backgroundImage: '',
        },
        labels: [
            {
                id: 'l401',
                title: 'Done',
                color: '#00c875',
            },
            {
                id: 'l402',
                title: 'Working on it',
                color: '#fdab3d',
            },
            {
                id: 'l403',
                title: 'Stuck',
                color: '#e2445c',
            },
        ],
        groups: [
            {
                id: 'g104',
                title: 'New group',
                archivedAt: null,
                tasks: [],
                style: {},
            },
        ],
        activities: [],
        columns: [
            { id: 'col' + makeId(), type: 'status', title: 'Status', isVisible: true, width: 150 },
            { id: 'col' + makeId(), type: 'date', title: 'Due Date', isVisible: true, width: 150 },],
    }
}

// ---- Groups & tasks ----

// Monday-like palette - a new group gets a random color from here
export const groupColors = [
    '#579bfc', '#00c875', '#fdab3d', '#e2445c', '#a25ddc', '#ffcb00',
    '#037f4c', '#bb3354', '#ff642e', '#66ccff', '#784bd1', '#9cd326',
]

// Task status values (stored on task.status) -> display title + color
export const statusOptions = [
    { id: 'done', title: 'Done', color: '#00c875' },
    { id: 'workingOnIt', title: 'Working on it', color: '#fdab3d' },
    { id: 'inProgress', title: 'In progress', color: '#579bfc' },
    { id: 'stuck', title: 'Stuck', color: '#e2445c' },
    { id: 'notStarted', title: 'Not started', color: '#797e93' },
]

// Task priority values (stored on task.priority) -> display title + color (monday's default priority labels)
export const priorityOptions = [
    { id: 'critical', title: 'Critical', color: '#333333' },
    { id: 'high', title: 'High', color: '#401694' },
    { id: 'medium', title: 'Medium', color: '#5559df' },
    { id: 'low', title: 'Low', color: '#579bfc' },
]

const EMPTY_STATUS = { id: '', title: '', color: '#c4c4c4' }

export const columnTypeOptions = [
    'status',
    'date',
    'text',
    'files',
    'priority',
    'timeline',
    // 'numbers',
    // 'timeline'
]

export function getStatusOption(statusId) {
    return statusOptions.find(option => option.id === statusId) || EMPTY_STATUS
}

export function getEmptyGroup() {
    return {
        id: 'g' + makeId(),
        title: 'New Group',
        archivedAt: null,
        style: { color: groupColors[getRandomIntInclusive(0, groupColors.length - 1)] },
        tasks: [],
    }
}

export function getEmptyTask(title = '', board) {
    return {
        id: 'c' + makeId(),
        title,
        values: _getEmptyColumnValues(board.columns),
        description: '',
        byMember: null,
        comments: [],
        checklists: [],
        style: {},
    }
}

function filterBoardsByView(boards, view) {
    if (!boards.length) return

    let filteredBoards = [...boards]

    switch (view) {
        case 'favorites':
            filteredBoards = boards.filter(board => board.isStarred)
            break
        case 'worskpace':
            break;
    }
    return filteredBoards
}
function getDefaultFilter() {
    return {
    }
}

function removeColumnFromBoard(board, colId) {
    const updatedBoard = JSON.parse(JSON.stringify(board))

    updatedBoard.columns = updatedBoard.columns.filter(column => column.id !== colId)
    updatedBoard.groups = updatedBoard.groups.map(group => {
        return {
            ...group,
            tasks: group.tasks.map(task => {
                const newTask = { ...task }
                delete newTask[colId]
                return newTask
            })
        }
    })
    return updatedBoard
}




function addColumnToBoard(board, column) {
    const updatedBoard = JSON.parse(JSON.stringify(board))

    const colId = 'col' + makeId()
    updatedBoard.columns = [
        ...updatedBoard.columns,
        {
            "id": colId,
            "type": column.type,
            "title": column.title || _getDefaultColumnTitle(column.type),
            "isVisible": true,
            "width": 150
        },
    ]
    updatedBoard.groups = board.groups.map(group => {
        return {
            ...group,
            tasks: group.tasks.map(task => {
                const newTask = {
                    ...task,
                    values: {
                        ...task.values,
                        [colId]: _getDefaultColumnValues(column.type)
                    }
                }
                return newTask
            })
        }
    })

    return updatedBoard


}

function _getDefaultColumnValues(columnType) {
    const defaultValByType = {
        status: '',
        date: '',
        text: '',
        members: [],
        files: [],
        priority: '',
        timeline: { startDate: '', endDate: '' }
    }
    return defaultValByType[columnType]
}

function _getDefaultColumnTitle(columnType) {
    const defaultTitleByType = {
        status: 'Status',
        date: 'Date',
        text: 'Text',
        members: 'Members',
        files: 'Files',
        priority: 'Priority',
        timeline: 'Timeline'
    }
    return defaultTitleByType[columnType]
}

function _getEmptyColumnValues(columns) {
    const values = columns.reduce((acc, col) => {
        console.log('col', col)
        console.log('acc', acc)
        acc[col.id] = _getDefaultColumnValues(col.type)
        return acc
    }, {})

    return values
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = {
    removeColumnFromBoard,
    getEmptyBoard,
    getEmptyGroup,
    getEmptyTask,
    filterBoardsByView,
    getDefaultFilter,
    addColumnToBoard,
    ...service
}

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
