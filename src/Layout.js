import React, {useState} from 'react';
import {Outlet, Link, useLocation} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import {
    Box, Drawer as MuiDrawer, Toolbar, IconButton,
    List, ListItemButton, ListItemIcon, ListItemText, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DataIcon from '@mui/icons-material/DataObject';
import InfoIcon from '@mui/icons-material/Info';
import SwapIcon from '@mui/icons-material/SwapHoriz';

const rail = 56;
const full = 240;

/* mini-variant --------------------------------------------------- */
const opened = t => ({
    width: full,
    overflowX: 'hidden',
    zIndex: 1300,
    transition: t.transitions.create('width', {duration: 200})
});
const closed = t => ({
    width: rail,
    overflowX: 'hidden',
    transition: t.transitions.create('width', {duration: 200})
});

const Drawer = styled(MuiDrawer, {shouldForwardProp: p => p !== 'open'})(
    ({theme, open}) => ({
        whiteSpace: 'nowrap',
        flexShrink: 0,
        boxSizing: 'border-box',
        ...(open ? opened(theme) : closed(theme)),
        '& .MuiDrawer-paper': {
            ...(open ? opened(theme) : closed(theme)),
            boxShadow: theme.shadows[2]
        }
    })
);

const Main = styled('main')({
    flexGrow: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16      // only vertical padding – no horizontal gutters
});

const routes = [
    {path: '/format', label: 'JSON Formatter', icon: <DataIcon/>},
    {path: '/escape', label: 'JSON String Escaper', icon: <SwapIcon/>},
    {path: '/about', label: 'About', icon: <InfoIcon/>}
];

export default function Layout() {
    const [open, setOpen] = useState(false);
    const {pathname} = useLocation();

    return (
        <Box sx={{display: 'flex'}}>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    disableGutters
                    sx={{
                        pr: open ? 1 : 0,
                        justifyContent: open ? 'flex-end' : 'center'
                    }}
                >
                    <IconButton size="small" onClick={() => setOpen(o => !o)}>
                        {open ? <ChevronLeftIcon/> : <MenuIcon/>}
                    </IconButton>
                </Toolbar>

                <List>
                    {routes.map(r => (
                        <Tooltip key={r.path} title={!open ? r.label : ''} placement="right">
                            <ListItemButton
                                component={Link}
                                to={r.path}
                                selected={pathname === r.path}
                                sx={{justifyContent: open ? 'initial' : 'center'}}
                            >
                                <ListItemIcon
                                    sx={{minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center'}}
                                >{r.icon}</ListItemIcon>
                                <ListItemText primary={r.label} sx={{opacity: open ? 1 : 0}}/>
                            </ListItemButton>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>

            <Main>
                <Outlet/>
            </Main>
        </Box>
    );
}