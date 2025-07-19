/* format the longest valid prefix ---------------------------------- */
export function formatPrefix(src, indent) {
    let i = src.trimEnd().length;
    while (i) {
        try {
            const pretty = JSON.stringify(JSON.parse(src.slice(0, i)), null, indent);
            return {ok: true, pretty, idx: i};
        } catch {
            i--;
        }
    }
    return {ok: false, idx: findErrPos(src)};
}

/* extract "position N" from the native JSON.parse message ---------- */
function findErrPos(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        const m = String(e.message).match(/position (\d+)/i);
        if (m) return Number(m[1]);
    }
    return 0;
}

/* absolute index -> 1-based line / column -------------------------- */
export function idxToLineCol(str, idx) {
    const lines = str.slice(0, idx).split('\n');
    return {line: lines.length, col: lines[lines.length - 1].length + 1};
}