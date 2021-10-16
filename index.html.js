"use strict";

const g = document.getElementById.bind(document);

function main() {
    let pattern;
    try {
        pattern = new URLMatchPattern(g("pattern").value);
        g("pattern-analysis").textContent = "RegExp: " + pattern.toRegExp().toString();
    }
    catch(e) { g("pattern-analysis").textContent = "invalid pattern"; }

    try {
        const url = new URL(g("url").value);
        if(!pattern) return;
        g("match-result").textContent = pattern.test(url) ? "matched" : "not matched";
    }
    catch(e) { g("match-result").textContent = "invalid url"; }
}

g("pattern").addEventListener("input", main);
g("url").addEventListener("input", main);

main();
