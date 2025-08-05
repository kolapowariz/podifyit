export function chuckText(txt: string, max = 3_000) {
    const out: string[] = [];
    let i = 0;
    while (i < txt.length) {
        let end = Math.min(i + max, txt.length);
        end = txt.lastIndexOf('.', end) + 1 || end;
        out.push(txt.slice(i, end).trim());
        i = end;
    }
    return out;
}