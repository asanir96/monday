import { useState } from 'react'
import { Popover, Button, Typography, Box } from '@mui/material'
import '../assets/styles/setup/var.css'
export function DropdownMenu({ handleClick, handleClose, anchorEl, children }) {

    return (<Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 10,
            horizontal: -26,
        }}
        slotProps={{
            paper: {
                sx: {
                    boxShadow: 'var(--box-shadow-medium)',
                    padding: '8px'
                },
            },
        }}
    >
        {children}
    </Popover>
    )
}