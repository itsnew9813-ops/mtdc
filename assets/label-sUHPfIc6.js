import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t,
    t as n
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t as r
} from "./dist-B-uvUq6S.js";
import {
    t as i
} from "./dist-BSxqYw3U.js";
import {
    t as a
} from "./utils-DojpP95n.js";
var o = e(t(), 1),
    s = n(),
    c = Object.defineProperty,
    l = o.forwardRef(((e, t) => c(e, `name`, {
        value: t,
        configurable: !0
    }))(function(e, t) {
        return (0, s.jsx)(i.label, { ...e,
            ref: t,
            onMouseDown: t => {
                t.target.closest(`button, input, select, textarea`) || (e.onMouseDown ?.(t), !t.defaultPrevented && t.detail > 1 && t.preventDefault())
            }
        })
    }, `Label`)),
    u = r(`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`),
    d = o.forwardRef(({
        className: e,
        ...t
    }, n) => (0, s.jsx)(l, {
        ref: n,
        className: a(u(), e),
        ...t
    }));
d.displayName = l.displayName;
export {
    d as t
};