function parseCsv(s) {

    function log(...args) {
        if (false)
            console.log("[debug]", ...args)
    }

    function advance(n = 1) {
        i = i + n
        l1 = s[i] || ''
        l2 = s[i + 1] || ''
        log("-- next", l1, l2)
    }

    let i = -1
    let l1, l2
    advance()

    function expect(c) {
        if (l1 !== c) {
            error("expected '" + c + "' instead got: '" + l1 + "'")
        }
    }

    function error(msg) {
        throw new Error('Parse error: ' + "At position: " + i + ", '" + s.substring(i, i + 10) + "' Parse error: " + msg)
    }

    // ---

    function acceptDoc() {
        log("doc", l1)
        acceptFieldset()
        if (l1 !== '') {
            acceptNl()
            acceptDoc()
        }
    }

    function acceptFieldset() {
        log("fieldset", l1)
        rows.push([])
        acceptField()
        if (l1 !== '' && l1 !== '\n') {
            acceptComma()
            acceptFieldset()
        }
    }

    function acceptField() {
        log("field", l1)
        if (l1 === '"') {
            acceptQuotedString()
        } else {
            acceptUnquotedString()
        }
    }

    function acceptQuotedString() {
        log("quotedString", l1)
        acceptQuote()
        // keep scanning until next lone quote is found
        // X(?!Y) X if not followed by Y
        acceptRestOfQuotedString()
    }

    function acceptNl() {
        log("nl", l1)
        expect('\n')
        advance()
    }

    function acceptComma() {
        log("comma", l1)
        expect(',')
        advance()
    }

    function acceptQuote() {
        log("quote", l1)
        expect('"')
        advance()
    }


    function acceptRestOfQuotedString() {
        log("rest", l1)
        // keep moving forward until a lone quote is reached
        // expect
        let stop = false;
        let start = i
        while (!stop) {
            if (l1 === '') {
                error("unexpectedly reached eof")
            } else if (l1 === '"' && l2 === '"') {
                // skip
                advance()
            } else if (l1 === '"') {
                stop = true;
            }
            // advance
            advance()
        }
        rows[rows.length - 1].push(s.substring(start, i - 1))
    }


    function acceptUnquotedString() {
        log("unquoted", l1)
        // expect
        // until next (comma|newline|quote|EOF)
        const m = s.substring(i).match(/([,\n"]|$)/)
        if (!m) error("expected unquoted string")
        rows[rows.length - 1].push(s.substring(i, i + m.index))
        advance(m.index)
    }

    let rows = []
    acceptDoc()
    return rows
}

module.exports = {
    parseCsv
}
