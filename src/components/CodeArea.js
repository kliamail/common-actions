import React, {
  useRef, useState, useImperativeHandle, forwardRef
} from 'react';
import { Box, IconButton, Tooltip, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import CodeMirror from '@uiw/react-codemirror';
import { json }   from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { useTheme } from '@mui/material/styles';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

/* CodeArea exposes:
   • goto(pos)
   • isFullSelection() – true if the current selection spans the whole doc
*/
const CodeArea = forwardRef(function CodeArea(
  { value, onChange, placeholder='',
    onPaste, onKeyCapture },        // ← custom callback names
  ref
){
  const mui     = useTheme();
  const themeCM = mui.palette.mode==='light'? githubLight : githubDark;
  const viewRef = useRef(null);

  const [copied,setCopied] = useState(false);
  const [cursor,setCursor] = useState({ line:1, col:1 });

  /* public API ---------------------------------------------------- */
  useImperativeHandle(ref, () => ({
    goto(pos){
      const v = viewRef.current?.view;
      if(!v) return;
      v.dispatch({
        selection:{ anchor:pos },
        effects:  EditorView.scrollIntoView(pos,{y:'center'})
      });
      v.focus();
    },
    isFullSelection(){
      const v = viewRef.current?.view;
      if(!v) return false;
      const sel = v.state.selection.main;
      return sel.from === 0 && sel.to === v.state.doc.length;
    }
  }));

  /* caret tracker ------------------------------------------------- */
  const handleUpdate = vu=>{
    if(!vu.selectionSet) return;
    const head = vu.state.selection.main.head;
    const ln   = vu.state.doc.lineAt(head);
    setCursor({ line: ln.number, col: head - ln.from + 1 });
  };

  const copy = async ()=>{
    try{ await navigator.clipboard.writeText(value); setCopied(true); }catch{}
  };

  return (
    <Box
      sx={{ position:'relative', flex:1, minHeight:0 }}
      onPasteCapture={onPaste}           /* parent may intercept */
      onKeyDownCapture={onKeyCapture}    /* stop Ctrl+Enter before CM */
    >
      <Tooltip title="Copy">
        <IconButton
          size="small"
          sx={{ position:'absolute', top:6, right:12, zIndex:5 }}
          onClick={copy}
        >
          <ContentCopyIcon fontSize="small"/>
        </IconButton>
      </Tooltip>

      <CodeMirror
        ref={viewRef}
        value={value}
        onChange={onChange}
        onUpdate={handleUpdate}
        placeholder={placeholder}
        height="100%"
        extensions={[json(), EditorView.lineWrapping]}
        theme={themeCM}
        basicSetup={{ highlightActiveLine:true, highlightActiveLineGutter:false }}
        style={{
          width:'100%', height:'100%',
          fontSize:14, fontFamily:mui.typography.monoFamily
        }}
      />

      {/* cursor ----------------------------------------------------- */}
      <Box sx={{
        position:'absolute', bottom:4, right:15,
        fontSize:12, opacity:.7, pointerEvents:'none'
      }}>
        {cursor.line}:{cursor.col}
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={1200}
        onClose={()=>setCopied(false)}
        message="Copied"
      />
    </Box>
  );
});

export default CodeArea;