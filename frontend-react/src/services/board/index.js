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
        cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
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
    { id: 'stuck', title: 'Stuck', color: '#df2f4a' },
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

export function getStatusOption(statusId) {
    return statusOptions.find(option => option.id === statusId) || EMPTY_STATUS
}

// How many of the tasks have each label - for the progress bar under a label column (LabelSummary).
// getLabelSummary(group.tasks, 'status', statusOptions) -> [{ id, title, color, count }]
// In the labels' order, only labels that are used, and the tasks with no label last (id '', grey) - like monday
export function getLabelSummary(tasks, field, options) {
    const countById = tasks.reduce((acc, task) => {
        const labelId = options.some(option => option.id === task[field]) ? task[field] : ''
        acc[labelId] = (acc[labelId] || 0) + 1
        return acc
    }, {})

    return [...options, EMPTY_STATUS]
        .filter(option => countById[option.id])
        .map(option => ({ ...option, count: countById[option.id] }))
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

export function getEmptyTask(title = '') {
    return {
        id: 'c' + makeId(),
        title,
        status: '',
        priority: '',
        dueDate: '',
        description: '',
        memberIds: [],
        labelIds: [],
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

const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = { getEmptyBoard, getEmptyGroup, getEmptyTask, filterBoardsByView, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
