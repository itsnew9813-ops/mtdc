import {
    r as e,
    t
} from "./rolldown-runtime-hePW80VL.js";
import {
    n,
    t as r
} from "./jsx-runtime-DE3RlOCf.js";

function i(e) {
    return e ?.isNotFound === !0
}

function a(e) {
    return e[e.length - 1]
}

function o(e, t) {
    return typeof e == `function` ? e(t) : e
}
var s = Object.prototype.hasOwnProperty;

function c(e) {
    for (let t in e)
        if (s.call(e, t)) return !0;
    return !1
}
var l = () => Object.create(null),
    u = (e, t) => d(e, t, !0);

function d(e, t, n, r = 0) {
    if (e === t) return e;
    if (r++ > 500) return t;
    let i = Array.isArray(e) && Array.isArray(t);
    if (!i && !(f(e) && f(t))) return t;
    let o = Object.keys(e),
        c = o.length,
        u = Object.keys(t),
        p = u.length;
    if (i ? c !== e.length || p !== t.length || c && a(o) !== `${c-1}` || p && a(u) !== `${p-1}` : c !== Object.getOwnPropertyNames(e).length || p !== Object.getOwnPropertyNames(t).length || Object.getOwnPropertySymbols(t).length) return t;
    let m = 0,
        h, g, _;
    if (i) {
        for (; m < p && (_ = m, g = e[_], h = t[_], h = g === h ? g : typeof g == `object` ? d(g, h, n, r) : h, h === g); m++);
        if (m === p && c === p) return e
    } else {
        let i = c === p,
            a = !0;
        for (; m < p; m++) {
            _ = u[m], g = e[_];
            let c = t[_];
            h = g === c ? g : typeof g == `object` ? d(g, c, n, r) : c, i &&= h === g && (o[m] === _ || s.call(e, _)), a &&= Object.is(h, c), o[m] = h
        }
        if (i) return Object.getOwnPropertySymbols(e).length ? t : e;
        if (a) return t
    }
    let v = i ? u.fill(0) : n ? l() : {};
    for (let a = 0; a < p; a++) _ = i ? a : u[a], i ? (g = e[_], a > m && (h = t[_], h = g === h ? g : typeof g == `object` ? d(g, h, n, r) : h), v[_] = a < m ? g : h) : v[_] = o[a];
    return v
}

function f(e) {
    return !e || typeof e != `object` ? !1 : (Object.getPrototypeOf(e) ?.constructor ?? Object) === Object
}

function p(e, t, n, r) {
    if (e === t) return !0;
    if (Array.isArray(e) && Array.isArray(t)) {
        if (e.length !== t.length) return !1;
        for (let i = 0, a = e.length; i < a; i++) {
            let a = e[i],
                o = t[i];
            if (a !== o && !p(a, o, n, r)) return !1
        }
        return !0
    }
    if (f(e) && f(t)) {
        if (n) {
            for (let i in t)
                if ((r || t[i] !== void 0) && !p(e[i], t[i], n, r)) return !1;
            return !0
        }
        let i = 0;
        if (r) i = Object.keys(e).length;
        else
            for (let t in e) e[t] !== void 0 && i++;
        for (let a in t)
            if ((r || t[a] !== void 0) && (i-- === 0 || !p(e[a], t[a], n, r))) return !1;
        return i === 0
    }
    return !1
}

function m(e) {
    return typeof e ?.message == `string` ? e.message.startsWith(`Failed to fetch dynamically imported module`) || e.message.startsWith(`error loading dynamically imported module`) || e.message.startsWith(`Importing a module script failed`) : !1
}
var h = /[\x00-\x1f\x7f"<>`{}]/g;

function g(e) {
    return e.replace(h, e => `%` + e.charCodeAt(0).toString(16).toUpperCase().padStart(2, `0`))
}

function _(e) {
    let t;
    try {
        t = decodeURI(e)
    } catch {
        t = e.replaceAll(/%[0-9A-F]{2}/gi, e => {
            try {
                return decodeURI(e)
            } catch {
                return e
            }
        })
    }
    return g(t)
}
var v = [`http:`, `https:`, `mailto:`, `tel:`];

function y(e) {
    if (e[0] !== `/` && e.includes(`:`)) return /^[\x00-\x20]*([a-z][a-z\d+.\t\n\r-]*:)/i.exec(e) ?.[1] ?.replace(/[\t\n\r]/g, ``).toLowerCase()
}
var b = /^[\x00-\x20]*[\\/][\t\n\r]*[\\/]/;

function x(e, t) {
    if (!e) return !1;
    if (b.test(e)) return !0;
    let n = y(e);
    return n ? !t.has(n) : !1
}
var S = {
        "&": `\\u0026`,
        ">": `\\u003e`,
        "<": `\\u003c`,
        "\u2028": `\\u2028`,
        "\u2029": `\\u2029`
    },
    C = /[&><\u2028\u2029]/g;

function ee(e) {
    return e.replace(C, e => S[e])
}

function w(e) {
    if (!e) return e;
    let t = e;
    if (/[%\\\x00-\x1f\x7f]/.test(e)) {
        let n = /%25|%5C/gi,
            r = 0,
            i;
        for (t = ``;
            (i = n.exec(e)) !== null;) t += _(e.slice(r, i.index)) + i[0], r = n.lastIndex;
        t += _(r ? e.slice(r) : e)
    }
    return t
}

function te(e) {
    return /[\s\u0080-\uFFFF]/.test(e) ? e.replace(/\s|[^\u0000-\u007F]/gu, encodeURIComponent) : e
}

function ne(e, t) {
    if (e === t) return !0;
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++)
        if (e[n] !== t[n]) return !1;
    return !0
}

function T(e) {
    return e.replace(/\/{2,}/g, `/`)
}

function E(e) {
    return e === `/` ? e : e.replace(/^\/+/, ``)
}

function D(e) {
    let t = e.length;
    return t > 1 && e[t - 1] === `/` ? e.replace(/\/+$/, ``) : e
}

function O(e) {
    return D(E(e))
}

function k(e, t) {
    return e ?.endsWith(`/`) && e !== `/` && e !== `${t}/` ? e.slice(0, -1) : e
}

function A(e, t, n = `never`, r) {
    if (t.includes(`//`) && (t = T(t)), t.startsWith(`/`)) return t.length === 1 || n === `preserve` ? t : n === `always` ? t.endsWith(`/`) ? t : `${t}/` : t.endsWith(`/`) ? t.slice(0, -1) : t;
    let i = t === `.`,
        o;
    if (r) {
        o = i ? e : e + `\0` + t;
        let n = r.get(o);
        if (n) return n
    }
    let s;
    if (i) s = e.split(`/`);
    else {
        for (e.includes(`//`) && (e = T(e)), s = e.split(`/`); s.length > 1 && a(s) === ``;) s.pop();
        let n = t.split(`/`);
        for (let e = 0, t = n.length; e < t; e++) {
            let r = n[e];
            r === `` ? e ? e === t - 1 && s.push(r) : s = [r] : r === `..` ? s.length > 1 ? s.pop() : s = [``] : r === `.` || s.push(r)
        }
    }
    s.length > 1 && (a(s) === `` ? n === `never` && s.pop() : n === `always` && s.push(``));
    let c = s.join(`/`),
        l = (i ? T(c) : c) || `/`;
    return o && r && r.set(o, l), l
}

function j(e) {
    let t = new Map(e.map(e => [encodeURIComponent(e), e])),
        n = new RegExp([...t.keys()].join(`|`).replace(/[.*()]/g, `\\$&`), `g`);
    return e => e.replace(n, e => t.get(e) ?? e)
}

function M(e) {
    return e == null || e === ``
}

function N(e, t, n) {
    if (typeof t != `string`) return `` + (t ?? void 0);
    let r = e === `_splat`;
    if (r && (!t || /^[a-zA-Z0-9\-._~!/]*$/.test(t))) return t;
    let i = encodeURIComponent(t);
    return r && (i = i.replaceAll(`%2F`, `/`)), n ? n(i) : i
}

function P(e, t, n, r, i) {
    let a = e.endsWith(`/`) ? `/` : ``,
        o = ``;
    for (let e of t) {
        if (typeof e == `string`) {
            o += e;
            continue
        }
        let [t, s, c, l] = e, u = t === 2, d = u && l !== void 0 ? l + a : l, f = n[s];
        if (t !== 3 || f != null) {
            if (i && (i[s] = f, u && (i[`*`] = f)), u && M(f)) {
                if (c === `/` && !d) continue;
                f = ``
            }
            o += c + N(s, f, r) + (d || ``)
        }
    }
    return o + a || `/`
}

function F() {
    throw Error(`Invariant failed`)
}
var I = `__root__`,
    L = `Error preloading route! ☝️`,
    R = e(n(), 1),
    z = r(),
    B = class extends R.Component {
        constructor(...e) {
            super(...e), this.state = {
                error: 0
            }, this.reset = () => {
                this.setState({
                    error: 0
                })
            }
        }
        static getDerivedStateFromProps(e, t) {
            let n = e.getResetKey();
            return t.error && t.resetKey !== n ? {
                resetKey: n,
                error: 0
            } : {
                resetKey: n
            }
        }
        static getDerivedStateFromError(e) {
            return {
                error: [e]
            }
        }
        componentDidCatch(e, t) {
            this.props.onCatch ?.(e, t)
        }
        render() {
            let e = this.state.error;
            return e ? R.createElement(this.props.errorComponent ?? V, {
                error: e[0],
                reset: this.reset
            }) : this.props.children
        }
    };

function V({
    error: e
}) {
    let [t, n] = R.useState(!1);
    return (0, z.jsxs)(`div`, {
        style: {
            padding: `.5rem`,
            maxWidth: `100%`
        },
        children: [(0, z.jsxs)(`div`, {
            style: {
                display: `flex`,
                alignItems: `center`,
                gap: `.5rem`
            },
            children: [(0, z.jsx)(`strong`, {
                style: {
                    fontSize: `1rem`
                },
                children: `Something went wrong!`
            }), (0, z.jsx)(`button`, {
                style: {
                    appearance: `none`,
                    fontSize: `.6em`,
                    border: `1px solid currentColor`,
                    padding: `.1rem .2rem`,
                    fontWeight: `bold`,
                    borderRadius: `.25rem`
                },
                onClick: () => n(e => !e),
                children: t ? `Hide Error` : `Show Error`
            })]
        }), (0, z.jsx)(`div`, {
            style: {
                height: `.25rem`
            }
        }), t ? (0, z.jsx)(`div`, {
            children: (0, z.jsx)(`pre`, {
                style: {
                    fontSize: `.7em`,
                    border: `1px solid red`,
                    borderRadius: `.25rem`,
                    padding: `.3rem`,
                    color: `red`,
                    overflow: `auto`
                },
                children: e ?.message ? (0, z.jsx)(`code`, {
                    children: e.message
                }) : null
            })
        }) : null]
    })
}
var re = () => !0,
    ie = () => !1;

function ae({
    children: e,
    fallback: t = null
}) {
    return (0, z.jsx)(R.Fragment, {
        children: H() ? e : t
    })
}

function H(e = !0) {
    return R.useSyncExternalStore(oe, re, e ? ie : re)
}

function oe() {
    return () => {}
}
var se = R.createContext(null);

function U(e) {
    return R.useContext(se)
}
var W = R.createContext(void 0),
    ce = R.createContext(void 0),
    le = t((e => {
        var t = n();

        function r(e, t) {
            return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t
        }
        var i = typeof Object.is == `function` ? Object.is : r,
            a = t.useState,
            o = t.useEffect,
            s = t.useLayoutEffect,
            c = t.useDebugValue;

        function l(e, t) {
            var n = t(),
                r = a({
                    inst: {
                        value: n,
                        getSnapshot: t
                    }
                }),
                i = r[0].inst,
                l = r[1];
            return s(function() {
                i.value = n, i.getSnapshot = t, u(i) && l({
                    inst: i
                })
            }, [e, n, t]), o(function() {
                return u(i) && l({
                    inst: i
                }), e(function() {
                    u(i) && l({
                        inst: i
                    })
                })
            }, [e]), c(n), n
        }

        function u(e) {
            var t = e.getSnapshot;
            e = e.value;
            try {
                var n = t();
                return !i(e, n)
            } catch {
                return !0
            }
        }

        function d(e, t) {
            return t()
        }
        var f = typeof window > `u` || window.document === void 0 || window.document.createElement === void 0 ? d : l;
        e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore
    })),
    ue = t(((e, t) => {
        t.exports = le()
    })),
    de = t((e => {
        var t = n(),
            r = ue();

        function i(e, t) {
            return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t
        }
        var a = typeof Object.is == `function` ? Object.is : i,
            o = r.useSyncExternalStore,
            s = t.useRef,
            c = t.useEffect,
            l = t.useMemo,
            u = t.useDebugValue;
        e.useSyncExternalStoreWithSelector = function(e, t, n, r, i) {
            var d = s(null);
            if (d.current === null) {
                var f = {
                    hasValue: !1,
                    value: null
                };
                d.current = f
            } else f = d.current;
            d = l(function() {
                function e(e) {
                    if (!o) {
                        if (o = !0, s = e, e = r(e), i !== void 0 && f.hasValue) {
                            var t = f.value;
                            if (i(t, e)) return c = t
                        }
                        return c = e
                    }
                    if (t = c, a(s, e)) return t;
                    var n = r(e);
                    return i !== void 0 && i(t, n) ? (s = e, t) : (s = e, c = n)
                }
                var o = !1,
                    s, c, l = n === void 0 ? null : n;
                return [function() {
                    return e(t())
                }, l === null ? void 0 : function() {
                    return e(l())
                }]
            }, [t, n, r, i]);
            var p = o(e, d[0], d[1]);
            return c(function() {
                f.hasValue = !0, f.value = p
            }, [p]), u(p), p
        }
    })),
    fe = t(((e, t) => {
        t.exports = de()
    }))();

function pe(e, t) {
    return e === t
}

function G(e, t = e => e, n) {
    let r = n ?.compare ?? pe,
        i = (0, R.useCallback)(t => {
            let {
                unsubscribe: n
            } = e.subscribe(t);
            return n
        }, [e]),
        a = (0, R.useCallback)(() => e.get(), [e]);
    return (0, fe.useSyncExternalStoreWithSelector)(i, a, a, t, r)
}
var me = {};

function he(e, t) {
    let n = R.useRef();
    return r => {
        let i = e ?.select ? e.select(r) : r;
        return e ?.structuralSharing ?? t.options.defaultStructuralSharing ? n.current = d(n.current, i) : i
    }
}

function ge(e) {
    let t = U(),
        n = R.useContext(e.from ? ce : W),
        r = e.from ?? n,
        i = t.stores.getMatchStore(r),
        a = he(e, t),
        o = G(i, e => e ? a(e) : me);
    if (o !== me) return o;
    (e.shouldThrow ?? !0) && F()
}

function _e(e) {
    return ge({
        from: e.from,
        shouldThrow: e.shouldThrow,
        structuralSharing: e.structuralSharing,
        strict: e.strict,
        select: t => {
            let n = e.strict === !1 ? t.params : t._strictParams;
            return e.select ? e.select(n) : n
        }
    })
}

function K(e) {
    let t = U();
    return R.useCallback(n => t.navigate({ ...n,
        from: n.from ?? e ?.from
    }), [e ?.from, t])
}

function ve(...e) {
    let t = R.useRef(e),
        n = t.current;
    return e.forEach((e, t) => {
        p(n[t], e, !1, !0) || (n[t] = e)
    }), t.current
}

function q(e, t) {
    e.preloadRoute(t).catch(e => {
        console.warn(e), console.warn(L)
    })
}
var ye = {
    compare: (e, t) => e[0] === t[0] && e[1] === t[1]
};

function be(e, t) {
    let n = typeof e == `string` && y(e);
    if (n) return t.has(n) ? e : null
}

function xe(e, t, n, r, i) {
    let a = k(e.pathname, r),
        o = k(t.pathname, r);
    return (n ?.exact ? a !== o : !(a.startsWith(o) && (a.length === o.length || a[o.length] === `/`))) || (n ?.includeSearch ?? !0) && !p(e.search, t.search, !n ?.exact, n ?.explicitUndefined) ? !1 : !n ?.includeHash || i && e.hash === t.hash
}

function Se(e, t, n) {
    let r = U(),
        i = R.useRef(null),
        a = R.useCallback(e => {
            if (i.current = e, typeof t == `function`) return t(e);
            t && (t.current = e)
        }, [t]),
        {
            activeOptions: o,
            to: s,
            preload: c,
            preloadDelay: l,
            hashScrollIntoView: u,
            replace: d,
            startTransition: f,
            resetScroll: p,
            viewTransition: m,
            ignoreBlocker: h,
            disabled: g,
            target: _,
            onClick: v,
            onBlur: b,
            onFocus: x,
            onMouseEnter: S,
            onMouseLeave: C,
            onTouchStart: ee
        } = e,
        w = H(!!o ?.includeHash),
        [te, ne, T] = ve(e.search, e.params, o),
        [E, D] = R.useMemo(() => [e, { ...e
        }], [r, e.from, e._fromLocation, e.hash, e.to, te, ne, e.state, e.mask, e.unsafeRelative]),
        O = R.useMemo(() => {
            let e = be(s, r.protocolAllowlist);
            if (e !== void 0) {
                let t = [e ?? void 0];
                return () => t
            }
            let t, n;
            return e => {
                E._fromLocation || (D._fromLocation = e);
                let i = r.buildLocation(D),
                    a = Oe(i, r, g);
                return (!t || t[0] !== a) && (t = [a, !(g || a && !y(a)) && void 0], n = [a, !0]), t[1] !== void 0 && xe(e, i, T, r.basepath, w) ? n : t
            }
        }, [T, g, w, E, D, r, s]),
        [k, A] = G(r.stores.location, O, ye),
        j = A === void 0 && k,
        M = g || k === void 0,
        N = R.useRef(!1),
        P = e.reloadDocument || j || M ? !1 : c ?? r.options.defaultPreload,
        F = l ?? r.options.defaultPreloadDelay ?? 0,
        I = R.useCallback(e => {
            let t = e ?.isIntersecting;
            if (!(t ?? P === `intent`)) {
                t === !1 && Y(i);
                return
            }
            if (!F) {
                q(r, E);
                return
            }
            J.has(i) || J.set(i, setTimeout(() => {
                J.delete(i), q(r, E)
            }, F))
        }, [r, E, i, P, F]);
    R.useEffect(() => {
        if (!P) return;
        P === `render` && !N.current && (N.current = !0, q(r, E));
        let e = !0,
            t;
        return P === `viewport` && i.current && typeof IntersectionObserver == `function` && (t = new IntersectionObserver(t => {
            e && I(t.pop())
        }, {
            rootMargin: `100px`
        }), t.observe(i.current)), () => {
            e = !1, t ?.disconnect(), Y(i)
        }
    }, [r, E, P, I, i]);
    let L = Ee(e, n);
    if (L.ref = t ? a : i, j) return L.href = j, L;
    let z = e => {
            let t = _ ?? e.currentTarget.getAttribute(`target`);
            !M && !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && (!t || t === `_self`) && e.button === 0 && (e.preventDefault(), r.navigate({ ...E,
                replace: d,
                resetScroll: p,
                hashScrollIntoView: u,
                startTransition: f,
                viewTransition: m,
                ignoreBlocker: h
            }))
        },
        B = () => {
            P === `intent` && q(r, E)
        },
        V = () => {
            P === `intent` && Y(i)
        };
    return L.onClick = X(v, z), L.onBlur = X(b, V), L.onFocus = X(x, I), L.onMouseEnter = X(S, I), L.onMouseLeave = X(C, V), L.onTouchStart = X(ee, B), De(L, e, A, k, M, n)
}
var Ce = {},
    we = {
        className: `active`
    },
    Te = new Set([`to`, `params`, `search`, `hash`, `state`, `mask`, `from`, `unsafeRelative`, `_fromLocation`, `reloadDocument`, `preload`, `preloadDelay`, `preloadIntentProximity`, `hashScrollIntoView`, `replace`, `startTransition`, `resetScroll`, `viewTransition`, `ignoreBlocker`, `activeProps`, `inactiveProps`, `activeOptions`, `_asChild`]);

function Ee(e, t) {
    let n = {};
    for (let r in e) Te.has(r) || r === `type` && t !== void 0 || r === `disabled` && t === `a` || (n[r] = e[r]);
    return n
}

function De(e, t, n, r, i, a) {
    let {
        activeProps: s,
        inactiveProps: c,
        className: l,
        style: u,
        target: d
    } = t, f = o(n ? s : c, {}) ?? (n ? we : Ce);
    Object.assign(e, f), e.href = r, a !== `a` && (e.disabled = i), e.target = d;
    let p = f.style;
    (u || p) && (e.style = u && p ? { ...u,
        ...p
    } : u || p);
    let m = f.className;
    return (l || m) && (e.className = l ? m ? `${l} ${m}` : l : m), i && (e.role = `link`, e[`aria-disabled`] = !0), n && (e[`data-status`] = `active`, e[`aria-current`] = `page`), e
}
var J = new WeakMap,
    Y = e => {
        clearTimeout(J.get(e)), J.delete(e)
    },
    X = (e, t) => e ? n => n.defaultPrevented || (e(n), n.defaultPrevented || t(n)) : t;

function Oe(e, t, n) {
    if (n) return;
    let r = e.maskedLocation ?? e,
        i = r.external ? r.publicHref : t.history.createHref(r.publicHref) || `/`;
    if (!((r.external || i !== r.publicHref) && x(i, t.protocolAllowlist))) return i
}
var ke = R.memo(R.forwardRef((e, t) => {
    let n = e._asChild || `a`,
        r = Se(e, t, n),
        i = typeof e.children == `function` ? e.children({
            isActive: r[`data-status`] === `active`
        }) : e.children;
    return R.createElement(n, r, i)
}), Ae);

function Ae(e, t) {
    let n = 0;
    for (let r in t)
        if (n++, e[r] !== t[r] && (!Te.has(r) || !p(e[r], t[r], !1, !0))) return !1;
    for (let t in e) n--;
    return n === 0
}

function je(e) {
    let t = U(),
        n = `not-found-${G(t.stores.location,e=>e.pathname)}-${G(t.stores.status)}`;
    return (0, z.jsx)(B, {
        getResetKey: () => n,
        onCatch: (t, n) => {
            if (i(t)) e.onCatch ?.(t, n);
            else throw t
        },
        errorComponent: ({
            error: t
        }) => {
            if (i(t)) return e.fallback ?.(t);
            throw t
        },
        children: e.children
    })
}

function Me() {
    return (0, z.jsx)(`p`, {
        children: `Not Found`
    })
}

function Ne(e, t, n) {
    return t.options.notFoundComponent ? (0, z.jsx)(t.options.notFoundComponent, { ...n
    }) : e.options.defaultNotFoundComponent ? (0, z.jsx)(e.options.defaultNotFoundComponent, { ...n
    }) : (0, z.jsx)(Me, {})
}

function Z(e, t) {
    let n = t ?.options.pendingComponent ?? e.options.defaultPendingComponent;
    return n ? (0, z.jsx)(n, {}) : null
}
var Pe = (e, t) => e[0] === t[0] && e[1] === t[1],
    Fe = (e, t, n) => !t.isRoot || t.options.shellComponent || t.options.wrapInSuspense || n === !1 || n === `data-only` || !e.ssr,
    Ie = R.memo(function({
        routeId: e
    }) {
        let t = U();
        return (0, z.jsx)(Le, {
            router: t,
            match: G(t.stores.getMatchStore(e))
        })
    });

function Le({
    router: e,
    match: t
}) {
    let n = e.routesById[t.routeId],
        r = Z(e, n),
        a = n.options.errorComponent ?? e.options.defaultErrorComponent,
        o = n.options.onCatch ?? e.options.defaultOnCatch,
        s = n.isRoot ? n.options.notFoundComponent ?? e.options.notFoundRoute ?.options.component : n.options.notFoundComponent,
        c = t.ssr === !1 || t.ssr === `data-only`,
        l = Fe(e, n, t.ssr) && (n.options.wrapInSuspense ?? r ?? (n.options.errorComponent ?.preload || c)),
        u = (0, z.jsx)(Re, {
            match: t
        });
    c && (u = (0, z.jsx)(ae, {
        fallback: r,
        children: u
    })), s && (u = (0, z.jsx)(je, {
        fallback: e => {
            if (e.routeId ??= t.routeId, e.routeId !== t.routeId) throw e;
            return R.createElement(s, e)
        },
        children: u
    })), a && (u = (0, z.jsx)(B, {
        getResetKey: () => t,
        errorComponent: a,
        onCatch: (e, n) => {
            if (i(e)) throw e.routeId ??= t.routeId, e;
            o ?.(e, n)
        },
        children: u
    })), l && (u = (0, z.jsx)(R.Suspense, {
        fallback: r,
        children: u
    }));
    let d = n.isRoot ? n.options.shellComponent : void 0;
    return (0, z.jsx)(W.Provider, {
        value: t.routeId,
        children: d ? (0, z.jsxs)(d, {
            children: [u, null]
        }) : (0, z.jsxs)(z.Fragment, {
            children: [u, null]
        })
    })
}
var Re = R.memo(function({
        match: e
    }) {
        let t = U(),
            n = e.routeId,
            r = t.routesById[n],
            i = R.useMemo(() => {
                let i = (r.options.remountDeps ?? t.options.defaultRemountDeps) ?.({
                    routeId: n,
                    loaderDeps: e.loaderDeps,
                    params: e._strictParams,
                    search: e._strictSearch
                });
                return i ? JSON.stringify(i) : void 0
            }, [n, e.loaderDeps, e._strictParams, e._strictSearch, r.options.remountDeps, t.options.defaultRemountDeps]),
            a = R.useMemo(() => {
                let e = r.options.component ?? t.options.defaultComponent;
                return e ? (0, z.jsx)(e, {}, i) : (0, z.jsx)(Q, {})
            }, [i, r.options.component, t.options.defaultComponent]);
        if (e.status === `pending`) {
            if (t.ssr && !Fe(t, r, e.ssr)) return a;
            if (t._tx) throw t._tx[5];
            return Z(t, r)
        }
        if (e.status === `notFound`) return Ne(t, r, e.error);
        if (e.status === `error`) throw e.error;
        return a
    }),
    Q = R.memo(function() {
        let e = U(),
            t = R.useContext(W),
            n, r, i; {
            let a = e.stores.getMatchStore(t);
            [n, r] = G(a, e => [!!e._notFound, e.error], {
                compare: Pe
            }), i = G(e.stores.ids, e => e[e.indexOf(t) + 1])
        }
        if (n) return Ne(e, e.routesById[t], r);
        if (!i) return null;
        let a = (0, z.jsx)(Ie, {
            routeId: i
        });
        return t === `__root__` ? (0, z.jsx)(R.Suspense, {
            fallback: Z(e),
            children: a
        }) : a
    });

function $(e) {
    let t = U();
    return G(t.stores.location, he(e, t))
}

function ze(e) {
    let [t, n] = (e ?? ``).split(`#`), [r, i] = t.split(`?`);
    return {
        pathname: r || `.`,
        search: i ? Object.fromEntries(new URLSearchParams(i)) : void 0,
        hash: n || void 0
    }
}

function Be() {
    let e = K(),
        t = U();
    return (0, R.useCallback)((n, r) => {
        if (typeof n == `number`) {
            t.history.go(n);
            return
        }
        let {
            pathname: i,
            search: a,
            hash: o
        } = ze(n);
        e({
            to: i,
            search: a,
            hash: o,
            state: r ?.state,
            replace: r ?.replace
        })
    }, [e, t])
}

function Ve() {
    let e = $();
    return (0, R.useMemo)(() => ({
        pathname: e.pathname,
        search: e.searchStr ? e.searchStr.startsWith(`?`) ? e.searchStr : `?${e.searchStr}` : ``,
        hash: e.hash ?? ``,
        state: e.state ?? null,
        key: e.pathname + (e.searchStr ?? ``)
    }), [e.pathname, e.searchStr, e.hash, e.state])
}

function He() {
    return _e({
        strict: !1
    })
}

function Ue() {
    let e = $(),
        t = K(),
        n = U();
    return [(0, R.useMemo)(() => new URLSearchParams(e.searchStr ?? ``), [e.searchStr]), (0, R.useCallback)((e, r) => {
        let i = n.state.location,
            a = new URLSearchParams(i.searchStr ?? ``),
            o = typeof e == `function` ? e(a) : e instanceof URLSearchParams ? e : new URLSearchParams(e),
            s = {};
        o.forEach((e, t) => {
            s[t] = e
        }), t({
            to: i.pathname,
            search: s,
            replace: r ?.replace
        })
    }, [t, n])]
}
var We = (0, R.forwardRef)(function({
        to: e,
        replace: t,
        state: n,
        children: r,
        ...i
    }, a) {
        let {
            pathname: o,
            search: s,
            hash: c
        } = ze(e);
        return (0, z.jsx)(ke, {
            ref: a,
            to: o,
            search: s,
            hash: c,
            replace: t,
            state: n,
            ...i ?? {},
            children : r
        })
    }),
    Ge = Q;
export {
    ne as A, x as B, j as C, E as D, O as E, ee as F, d as G, a as H, o as I, i as K, y as L, w as M, p as N, D as O, te as P, c as R, T as S, A as T, u as U, m as V, b as W, se as _, He as a, I as b, Ie as c, ke as d, K as f, U as g, G as h, Be as i, l as j, v as k, Q as l, ge as m, Ge as n, Ue as o, _e as p, Ve as r, $ as s, We as t, Z as u, H as v, P as w, F as x, B as y, s as z
};