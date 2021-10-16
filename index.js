class URLMatchPattern {
    static #resScheme = 'https?|wss?|ftp|file';
    static #resDomainLabel = '[0-9A-Za-z]+(?:\\-+[0-9A-Za-z]+)*';
    static #resMatchPattern =
        '^<all_urls>$|^(?:(?:file://|(?:(\\*|<scheme>)://(<host>)))(<path>))$'
        .replace('<scheme>', URLMatchPattern.#resScheme)
        .replace('<host>', '\\*|(?:\\*\\.)?<label>(?:\\.<label>)*'
            .replace(/<label>/g, URLMatchPattern.#resDomainLabel)
        )
        .replace('<path>', '/.*')
    ;
    static #reoMatchPattern = new RegExp(URLMatchPattern.#resMatchPattern);

    static test(pattern, url = '') {
        switch(arguments.length) {
            case 1:
                if(pattern instanceof URLMatchPattern) return true;
                try {
                    new URLMatchPattern(pattern);
                    return true;
                }
                catch(e) {
                    return false;
                }
            case 2:
                if(!(pattern instanceof URLMatchPattern))
                    pattern = new URLMatchPattern(pattern);
                return pattern.test(url);
            default:
                throw new TypeError('URLMatchPattern.test requires 1 or 2 arguments');
        }
    }

    static toRegExp(pattern, flags) {
        pattern = new URLMatchPattern(pattern);
        return pattern.toRegExp(flags);
    }

    #isAllUrls = false;
    #scheme;
    #host;
    #path;
    #regExp;

    XtoRegExp() {
        let res = '^';
        if(this.#isAllUrls) res += `(file://|(<scheme>)://<host>)`;
        else if(this.#scheme === '*') res += 'https?://<host>';
        else res += this.#scheme + '://<host>';
        res += '<path>$';

        res = res.replace('<scheme>', URLMatchPattern.#resScheme);

        let host = '';
        if(this.#host) {
            if(this.#host === '*') host = '(<label>\\.)*<label>';
            else {
                let subHost = this.#host;
                if(this.#host.startsWith('*.')) {
                    host = '(<label>\\.)*';
                    subHost = this.#host.substr(2);
                }
                host += subHost.replace(/[\.\-]/g, '\\$&');
            }
            host = host.replace(/<label>/g, URLMatchPattern.#resDomainLabel);
        }
        res = res.replace('<host>', host);

        res = res.replace('<path>', this.#path
            .replace(/[.+?^${}()|[\]\\\/]/g, '\\$&')
            .replace(/\*/g, '.*')
        );

        return new RegExp(res);
    }

    constructor(pattern) {
        if(arguments.length != 1)
            throw new TypeError('URLMatchPattern requires exact 1 argument');

        if(pattern === '<all_urls>') {
            this.#isAllUrls = true;
            pattern = '*://*/*';
        }
        else if(typeof pattern !== 'string')
            pattern = pattern.toString();

        const match = URLMatchPattern.#reoMatchPattern.exec(pattern);
        if(!match) throw new SyntaxError('Invalid URL match pattern: ' + pattern);
        this.#scheme = match[1] || 'file';
        this.#host = match[2] || '';
        this.#path = match[3];

        if(this.#scheme !== 'file' && !this.#host)
            throw new SyntaxError('Invalid URL match pattern: ' + pattern);

        this.#regExp = this.XtoRegExp();
    }

    valueOf() {
        if(this.#isAllUrls) return '<all_urls>';
        if(!this.#host) return {scheme: this.#scheme, path: this.#path};
        return {scheme: this.#scheme, host: this.#host, path: this.#path};
    }

    toString() {
        if(this.#isAllUrls) return '<all_urls>';
        return this.#scheme + '://' + this.#host + this.#path;
    }

    toRegExp(flags = '') {
        return new RegExp(this.#regExp, flags);
    }

    test(url) {
        if(!(url instanceof URL)) {
            try {
                url = new URL(url);
            }
            catch(e) {
                return false;
            }
        }
        url = `${url.protocol}//${url.hostname}${url.pathname}${url.search}`;
        return this.#regExp.test(url);
    }
}

if(typeof module != 'undefined' && module.exports)
    module.exports = URLMatchPattern;
