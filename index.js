'use strict';
class URLMatchPattern {
    static #resAllSchemes = 'https?|wss?|ftp|file';
    static #resDomainLabel = '[0-9A-Za-z]+(?:\\-+[0-9A-Za-z]+)*';
    static #resDomainName = `${URLMatchPattern.#resDomainLabel}(?:\\.(?:${URLMatchPattern.#resDomainLabel}))*`;
    static #reoMatchPattern = new RegExp(`^(\\*|${URLMatchPattern.#resAllSchemes}):\\/\\/(\\*|(?:\\*\\.)?${URLMatchPattern.#resDomainName})(\\/.*)$`);

    static test(pattern, url = '') {
        switch(arguments.length) {
            case 1:
                if(pattern instanceof URLMatchPattern) return true;
                return pattern === '<all_urls>' || URLMatchPattern.#reoMatchPattern.test(pattern.toString());
            case 2:
                if(!(pattern instanceof URLMatchPattern))
                    pattern = new URLMatchPattern(pattern.toString());
                return pattern.test(url.toString());
            default:
                throw new TypeError('URLMatchPattern.test requires 1 or 2 arguments');
        }
    }

    #isAllUrls = false;
    #scheme;
    #host;
    #path;
    #regExp;

    XtoRegExp() {
        const resPort = '\\:\\d{1,5}';
        let re = '^';

        if(this.#isAllUrls) re += `(${URLMatchPattern.#resAllSchemes})`;
        else if(this.#scheme == '*') re += '(https?)';
        else re += `(${this.#scheme})`;

        re += ':\\/\\/';

        if(this.#isAllUrls) re += `(?:(${URLMatchPattern.#resDomainName})(?:${resPort})?)?`; // for file:///path
        else {
            if(this.#host == '*') re += `(${URLMatchPattern.#resDomainName})`;
            else {
                let host = this.#host;
                let subRE = '';
                if(this.#host.startsWith('*.')) {
                    host = this.#host.substr(2);
                    subRE = `(?:${URLMatchPattern.#resDomainName}\\.)?`;
                }
                subRE += host.replace(/[\.\-]/g, '\\$&');
                re += `(${subRE})`;
            }
            re += `(?:${resPort})?`;
        }

        const subRE = this.#path
            .replace(/[.+?^${}()|[\]\\\/]/g, '\\$&')
            .replace(/\*/g, '.*');
        re += `(${subRE})`;

        re += '(?:#|$)';
        return new RegExp(re);
    }

    constructor(pattern, host = null, path = null) {
        if(pattern === '<all_urls>') {
            this.#isAllUrls = true;
            pattern = '*://*/*';
        }
        else if(typeof pattern === 'object')
            pattern = `${pattern.scheme}://${pattern.host}${pattern.path}`;
        else if(arguments.length === 3)
            pattern = `${pattern}://${host}${path}`;
        else if(arguments.length != 1)
            throw new TypeError('URLMatchPattern requires 1 or 3 arguments');

        const match = URLMatchPattern.#reoMatchPattern.exec(pattern);
        if(!match) throw new SyntaxError('Invalid URL match pattern: ' + pattern);
        this.#scheme = match[1];
        this.#host = match[2];
        this.#path = match[3];

        this.#regExp = this.XtoRegExp();
    }

    get scheme() { return this.#scheme; }
    get host() { return this.#host; }
    get path() { return this .#path; }
    get pattern() {
        if(this.#isAllUrls) return '<all_urls>';
        return this.#scheme + '://' + this.#host + this.#path;
    }

    valueOf() {
        return {scheme: this.#scheme, host: this.#host, path: this.#path};
    }

    toString() {
        return this.pattern;
    }

    toRegExp(flags = '') {
        return new RegExp(this.#regExp, flags);
    }

    test(url) {
        return this.#regExp.test(url);
    }
}

if(typeof module != 'undefined' && module.exports)
    module.exports = URLMatchPattern;
