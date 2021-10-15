# URL Match Pattern
a JavaScript package handles match patterns described in browser extension

See articles on [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns) and [Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/match_patterns/).

## Compatibility

scheme          | this project | Firefox 55+ | Chrome 91+ | Edge, Opera | Safari
----------------|--------------|-------------|------------|-------------|------
`http`, `https` | Yes          | Yes         | Yes        | Yes         | Yes
`ws`, `wss`     | Yes          | Yes         | No         | No          | No
`urn`           | No           | No          | Yes        | No          | No
`data`          | No           | partial     | No         | No          | No
`file`          | partial      | Yes         | Yes        | Yes         | No

## Defects of URL Match Pattern

* not well-defined
* no escaping way for `*` in path
