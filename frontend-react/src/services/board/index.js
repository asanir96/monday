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

function getDefaultFilter() {
    return {
        txt: '',
        minSpeed: '',
        sortField: '',
        sortDir: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const boardService = { getEmptyBoard, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
