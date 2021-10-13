class URLMatchPattern {
    #isAllUrls = false;
    #scheme;
    #host;
    #path;

    constructor(pattern, host = null, path = null) {
        switch(arguments.length) {
            case 1:
                switch(typeof pattern) {
                    case "string":
                        if(pattern === "<all_urls>") {
                            this.#isAllUrls = true;
                            this.#scheme = "*";
                            this.#host = "*";
                            this.#path = "/*";
                            break;
                        }
                        const match = /^(\*|https?|wss?|file|ftp):\/\/(\*|((\*\.)?([0-9A-Za-z]+(\-+[0-9A-Za-z]+)*\.)*[a-z]{2,}))(\/.*)$/.exec(pattern);
                        if(!match) throw new SyntaxError("Invalid URL match pattern: " + pattern);
                        this.#scheme = match[1];
                        this.#host = match[2];
                        this.#path = match[match.length - 1];
                        break;
                    case "object":
                        this.#scheme = pattern.scheme;
                        this.#host = pattern.host;
                        this.#path = pattern.path;
                        break;
                    default:
                        throw new TypeError("URLMatchPattern requires string or object");
                }
                break;
            case 3:
                this.#scheme = pattern;
                this.#host = host;
                this.#path = path;
                break;
            default:
                throw new TypeError("URLMatchPattern requires 1 or 3 arguments");
        }
        if(!["*", "http", "https", "file", "ftp"].includes(this.#scheme)) throw new SyntaxError("Invalid URL scheme: " + this.#scheme);
        if(!this.#path.startsWith("/")) throw new SyntaxError("Invalid URL path: " + this.#path);
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

    toRegExp(flags) {
        const reAllSchemes = 'https?|wss?|ftp|file';
        const reDomainLabel = '[0-9A-Za-z]+(?:\\-+[0-9A-Za-z]+)*';
        const reDomainName = `${reDomainLabel}(?:\\.(?:${reDomainLabel}))*`;
        const rePort = '\\:\\d{1,5}';

        let re = '^';

        if(this.#isAllUrls) re += `(${reAllSchemes})`;
        else if(this.#scheme == '*') re += '(https?)';
        else re += `(${this.#scheme})`;

        re += ':\\/\\/';

        if(this.#isAllUrls) re += `(?:(${reDomainName})(?:${rePort})?)?`; // for file:///path
        else {
            if(this.#host == '*') re += `(${reDomainName})`;
            else {
                let host = this.#host;
                let subRE = '';
                if(this.#host.startsWith('*.')) {
                    host = this.#host.substr(2);
                    subRE = `(?:${reDomainName}\\.)?`;
                }
                subRE += host.replace(/[\.\-]/g, '\\$&');
                re += `(${subRE})`;
            }
            re += `(?:${rePort})?`;
        }

        const subRE = this.#path
            .replace(/[.+?^${}()|[\]\\\/]/g, '\\$&')
            .replace(/\*/g, '.*');
        re += `(${subRE})`;

        re += '$';
        return new RegExp(re, flags);
    }

}

if(typeof module != "undefined" && module.exports)
    module.exports = URLMatchPattern;
