import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Box, Typography, ToggleButtonGroup, ToggleButton,
  Button, Alert
} from '@mui/material';
import CodeArea          from '../components/CodeArea';
import { CacheCtx }      from '../App';
import { formatPrefix, idxToLineCol } from './sharedHelpers';

export default function JsonFormatter() {
  const { cache, setCache } = useContext(CacheCtx);

  const [mode,  setMode] = useState('pretty');
  const [value, setVal]  = useState(cache.format ?? '');
  const [error, setErr]  = useState('');
  const editorRef        = useRef();

  /* ---------------- core runner ---------------------------------- */
  const run = src => {
    if (!src.trim()) { setErr(''); return; }

    const { ok, pretty, idx } =
      formatPrefix(src, mode === 'pretty' ? 2 : 0);

    if (ok) {
      const tail = src.slice(idx);
      setVal(pretty + tail);
      tail.trim() ? showErr(src, idx) : setErr('');
    } else showErr(src, idx);
  };

  const showErr = (src, idx) => {
    const { line, col } = idxToLineCol(src, idx);
    setErr(`Invalid JSON near line ${line}, column ${col}`);
    editorRef.current?.goto(idx);
  };

  /* -------------- cache ------------------------------------------ */
  useEffect(() => { setCache(c => ({ ...c, format: value })); }, [value, setCache]);

  /* re-format when mode toggles */
  useEffect(() => { run(value); }, [mode]);

  /* -------------- events ----------------------------------------- */
  const handlePaste = e => {
    const full = editorRef.current?.isFullSelection();
    if (full || !value.trim()) {          // empty OR replace-all
      const txt = e.clipboardData.getData('text');
      e.preventDefault();
      setVal(txt);
      run(txt);
    }
  };

  const handleKey = e => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();                 // no newline
      run(value);
    }
  };

  /* -------------- UI --------------------------------------------- */
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* title row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, pl: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>JSON Formatter</Typography>

        <ToggleButtonGroup
          size="small" exclusive color="primary"
          value={mode} onChange={(_, m) => m && setMode(m)}
        >
          <ToggleButton value="pretty">Pretty</ToggleButton>
          <ToggleButton value="minify">Minify</ToggleButton>
        </ToggleButtonGroup>

        <Button
          size="small" variant="contained" sx={{ ml: 1 }}
          onClick={() => run(value)}
        >
          {mode === 'pretty' ? 'Pretty (Ctrl+Enter)' : 'Minify (Ctrl+Enter)'}
        </Button>
      </Box>

      <CodeArea
        ref={editorRef}
        value={value}
        onChange={setVal}
        onPaste={handlePaste}
        onKeyCapture={handleKey}
        placeholder="Paste or type JSON…"
      />

      {error && (
        <Alert sx={{ mt: 1 }} severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      )}
    </Box>
  );
}