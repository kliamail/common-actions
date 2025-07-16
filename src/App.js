import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import DarkModeIcon  from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ReactGA from 'react-ga4';

import { getTheme } from './theme';
import Layout        from './Layout';
import About         from './tools/About';
import JsonFormatter from './tools/JsonFormatter';
import JsonEscaper   from './tools/JsonEscaper';

/* simple in-memory cache so every tool can persist its text  */
export const CacheCtx = createContext({ cache:{}, setCache:()=>{} });

export default function App() {
  const [mode, setMode]   = useState('light');
  const [cache,setCache]  = useState({});          /*  <-- new */
  const loc               = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType:'pageview', page:loc.pathname });
  }, [loc]);

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <IconButton
        size="small"
        sx={{ position:'fixed', top:13, right:12, zIndex:2500 }}
        onClick={() => setMode(m=>m==='light'?'dark':'light')}
        color="inherit"
      >
        {mode==='light'? <DarkModeIcon/> : <LightModeIcon/>}
      </IconButton>

      <CacheCtx.Provider value={{ cache, setCache }}>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/about"  element={<About/>}/>
            <Route path="/format" element={<JsonFormatter/>}/>
            <Route path="/escape" element={<JsonEscaper/>}/>
            <Route path="*"       element={<Navigate to="/format" replace/>}/>
          </Route>
        </Routes>
      </CacheCtx.Provider>
    </ThemeProvider>
  );
}