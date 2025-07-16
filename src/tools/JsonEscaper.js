import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Box, Typography, ToggleButtonGroup, ToggleButton,
  Button, Alert
} from '@mui/material';
import CodeArea         from '../components/CodeArea';
import { CacheCtx }     from '../App';
import { escapeString, unescapeString } from '../utils/stringEscape';

export default function JsonEscaper(){
  const { cache, setCache } = useContext(CacheCtx);

  const [mode,setMode]   = useState('unescape');             // default
  const [value,setValue] = useState(cache.escape ?? '');
  const [error,setErr]   = useState('');
  const editorRef        = useRef();

  /* -------------------------------- core ------------------------- */
  const run = src=>{
    if(!src.trim()){ setErr(''); return; }
    try{
      setValue(mode==='escape'?  escapeString(src)
                              : unescapeString(src));
      setErr('');
    }catch(e){ setErr(e.message); }
  };

  /* persist */
  useEffect(()=>{ setCache(c=>({...c, escape:value})); },[value,setCache]);

  /* re-run on mode switch */
  useEffect(()=>{ run(value); },[mode]);

  /* ------------- events ------------------------------------------ */
  const handlePaste = e=>{
    const full = editorRef.current?.isFullSelection();
    if(full || !value.trim()){                 // empty OR full replace
      const txt = e.clipboardData.getData('text');
      e.preventDefault();
      setValue(txt);
      run(txt);
    }
  };

  const handleKey = e=>{
    if(e.ctrlKey && e.key==='Enter'){
      e.preventDefault();                      // block newline
      run(value);
    }
  };

  /* ------------- UI ---------------------------------------------- */
  return (
    <Box sx={{ flex:1, display:'flex', flexDirection:'column', height:'100%' }}>
      {/* title row */}
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:1, pl:2 }}>
        <Typography variant="h6" sx={{ fontWeight:600 }}>
          JSON String Escaper
        </Typography>

        <ToggleButtonGroup
          size="small" exclusive color="primary"
          value={mode} onChange={(_,m)=>m&&setMode(m)}
        >
          <ToggleButton value="unescape">Unescape</ToggleButton>
          <ToggleButton value="escape">Escape</ToggleButton>
        </ToggleButtonGroup>

        <Button
          size="small" variant="contained" sx={{ ml:1 }}
          onClick={()=>run(value)}
        >
          {mode==='escape' ? 'Escape (Ctrl+Enter)' : 'Unescape (Ctrl+Enter)'}
        </Button>
      </Box>

      <CodeArea
        ref={editorRef}
        value={value}
        onChange={setValue}
        onPaste={handlePaste}
        onKeyCapture={handleKey}
        placeholder={
          mode==='escape'
            ? 'Raw string → JSON string literal'
            : 'Escaped JSON string literal'
        }
      />

      {error &&
        <Alert sx={{ mt:1 }} severity="error" onClose={()=>setErr('')}>
          {error}
        </Alert>}
    </Box>
  );
}