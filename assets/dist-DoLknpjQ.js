import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t,
    t as n
} from "./jsx-runtime-DE3RlOCf.js";
import {
    r
} from "./dist-B0Orvaj5.js";
import {
    i,
    n as a
} from "./dist-CICBZQnc.js";
import {
    a as o
} from "./dist-B-uvUq6S.js";
import {
    n as s,
    t as c
} from "./dist-BSxqYw3U.js";
var l = e(t(), 1),
    u = Object.defineProperty,
    d = (e, t) => u(e, `name`, {
        value: t,
        configurable: !0
    });

function f(e) {
    let t = l.useRef(e);
    return l.useEffect(() => {
        t.current = e
    }), l.useMemo(() => ((...e) => t.current ?.(...e)), [])
}
d(f, `useCallbackRef`);
var p = n(),
    m = Object.defineProperty,
    h = (e, t) => m(e, `name`, {
        value: t,
        configurable: !0
    }),
    g = `dismissableLayer.update`,
    _ = `dismissableLayer.pointerDownOutside`,
    v = `dismissableLayer.focusOutside`,
    y, b = l.createContext({
        layers: new Set,
        layersWithOutsidePointerEventsDisabled: new Set,
        branches: new Set,
        dismissableSurfaces: new Set
    }),
    x = l.forwardRef(h(function(e, t) {
        let {
            disableOutsidePointerEvents: n = !1,
            deferPointerDownOutside: r = !1,
            onEscapeKeyDown: a,
            onPointerDownOutside: s,
            onFocusOutside: u,
            onInteractOutside: d,
            onDismiss: m,
            ..._
        } = e, v = l.useContext(b), [x, S] = l.useState(null), C = x ?.ownerDocument ?? globalThis ?.document, [, w] = l.useState({}), O = o(t, S), k = Array.from(v.layers), [A] = [...v.layersWithOutsidePointerEventsDisabled].slice(-1), j = A ? k.indexOf(A) : -1, M = x ? k.indexOf(x) : -1, N = v.layersWithOutsidePointerEventsDisabled.size > 0, P = M >= j, F = l.useRef(!1), I = T(e => {
            s ?.(e), d ?.(e), e.defaultPrevented || m ?.()
        }, {
            ownerDocument: C,
            deferPointerDownOutside: r,
            isDeferredPointerDownOutsideRef: F,
            dismissableSurfaces: v.dismissableSurfaces,
            shouldHandlePointerDownOutside: l.useCallback(e => {
                if (!(e instanceof Node)) return !1;
                let t = [...v.branches].some(t => t.contains(e));
                return P && !t
            }, [v.branches, P])
        }), L = E(e => {
            if (r && F.current) return;
            let t = e.target;
            [...v.branches].some(e => e.contains(t)) || (u ?.(e), d ?.(e), e.defaultPrevented || m ?.())
        }, C), R = x ? M === k.length - 1 : !1, z = f(e => {
            e.key === `Escape` && (a ?.(e), !e.defaultPrevented && m && (e.preventDefault(), m()))
        });
        return l.useEffect(() => {
            if (R) return C.addEventListener(`keydown`, z, {
                capture: !0
            }), () => C.removeEventListener(`keydown`, z, {
                capture: !0
            })
        }, [C, R, z]), l.useEffect(() => {
            if (x) return n && (v.layersWithOutsidePointerEventsDisabled.size === 0 && (y = C.body.style.pointerEvents, C.body.style.pointerEvents = `none`), v.layersWithOutsidePointerEventsDisabled.add(x)), v.layers.add(x), D(), () => {
                n && (v.layersWithOutsidePointerEventsDisabled.delete(x), v.layersWithOutsidePointerEventsDisabled.size === 0 && (C.body.style.pointerEvents = y))
            }
        }, [x, C, n, v]), l.useEffect(() => () => {
            x && (v.layers.delete(x), v.layersWithOutsidePointerEventsDisabled.delete(x), D())
        }, [x, v]), l.useEffect(() => {
            let e = h(() => w({}), `handleUpdate`);
            return document.addEventListener(g, e), () => document.removeEventListener(g, e)
        }, []), (0, p.jsx)(c.div, { ..._,
            ref: O,
            style: {
                pointerEvents: N ? P ? `auto` : `none` : void 0,
                ...e.style
            },
            onFocusCapture: i(e.onFocusCapture, L.onFocusCapture),
            onBlurCapture: i(e.onBlurCapture, L.onBlurCapture),
            onPointerDownCapture: i(e.onPointerDownCapture, I.onPointerDownCapture)
        })
    }, `DismissableLayer`)),
    S = l.forwardRef(h(function(e, t) {
        let n = l.useContext(b),
            r = l.useRef(null),
            i = o(t, r);
        return l.useEffect(() => {
            let e = r.current;
            if (e) return n.branches.add(e), () => {
                n.branches.delete(e)
            }
        }, [n.branches]), (0, p.jsx)(c.div, { ...e,
            ref: i
        })
    }, `DismissableLayerBranch`));

function C() {
    let e = l.useContext(b),
        [t, n] = l.useState(null);
    return l.useEffect(() => {
        if (t) return e.dismissableSurfaces.add(t), () => {
            e.dismissableSurfaces.delete(t)
        }
    }, [t, e.dismissableSurfaces]), n
}
h(C, `useDismissableLayerSurface`);
var w = h(() => !0, `IS_TRUE`);

function T(e, t) {
    let {
        ownerDocument: n = globalThis ?.document,
        deferPointerDownOutside: r = !1,
        isDeferredPointerDownOutsideRef: i,
        dismissableSurfaces: a,
        shouldHandlePointerDownOutside: o = w
    } = t, s = f(e), c = l.useRef(!1), u = l.useRef(!1), d = l.useRef(new Map), p = l.useRef(() => {});
    return l.useEffect(() => {
        function e() {
            u.current = !1, i.current = !1, d.current.clear()
        }
        h(e, `resetOutsideInteraction`);

        function t() {
            return Array.from(d.current.values()).some(Boolean)
        }
        h(t, `isOutsideInteractionIntercepted`);

        function l(e) {
            if (!u.current) return;
            let t = e.target;
            t instanceof Node && [...a].some(e => e.contains(t)) || d.current.set(e.type, !0), e.type === `click` && window.setTimeout(() => {
                u.current && p.current()
            }, 0)
        }
        h(l, `handleInteractionCapture`);

        function f(e) {
            u.current && d.current.set(e.type, !1)
        }
        h(f, `handleInteractionBubble`);
        let m = h(a => {
                if (a.target && !c.current) {
                    let l = function() {
                        n.removeEventListener(`click`, p.current);
                        let r = t();
                        e(), r || O(_, s, f, {
                            discrete: !0
                        })
                    };
                    if (h(l, `handleAndDispatchPointerDownOutsideEvent`), !o(a.target)) {
                        n.removeEventListener(`click`, p.current), e(), c.current = !1;
                        return
                    }
                    let f = {
                        originalEvent: a
                    };
                    u.current = !0, i.current = r && a.button === 0, d.current.clear(), !r || a.button !== 0 ? l() : (n.removeEventListener(`click`, p.current), p.current = l, n.addEventListener(`click`, p.current, {
                        once: !0
                    }))
                } else n.removeEventListener(`click`, p.current), e();
                c.current = !1
            }, `handlePointerDown`),
            g = [`pointerup`, `mousedown`, `mouseup`, `touchstart`, `touchend`, `click`];
        for (let e of g) n.addEventListener(e, l, !0), n.addEventListener(e, f);
        let v = window.setTimeout(() => {
            n.addEventListener(`pointerdown`, m)
        }, 0);
        return () => {
            window.clearTimeout(v), n.removeEventListener(`pointerdown`, m), n.removeEventListener(`click`, p.current);
            for (let e of g) n.removeEventListener(e, l, !0), n.removeEventListener(e, f)
        }
    }, [n, s, r, i, a, o]), {
        onPointerDownCapture: h(() => c.current = !0, `onPointerDownCapture`)
    }
}
h(T, `usePointerDownOutside`);

function E(e, t = globalThis ?.document) {
    let n = f(e),
        r = l.useRef(!1);
    return l.useEffect(() => {
        let e = h(e => {
            e.target && !r.current && O(v, n, {
                originalEvent: e
            }, {
                discrete: !1
            })
        }, `handleFocus`);
        return t.addEventListener(`focusin`, e), () => t.removeEventListener(`focusin`, e)
    }, [t, n]), {
        onFocusCapture: h(() => r.current = !0, `onFocusCapture`),
        onBlurCapture: h(() => r.current = !1, `onBlurCapture`)
    }
}
h(E, `useFocusOutside`);

function D() {
    let e = new CustomEvent(g);
    document.dispatchEvent(e)
}
h(D, `dispatchUpdate`);

function O(e, t, n, {
    discrete: r
}) {
    let i = n.originalEvent.target,
        a = new CustomEvent(e, {
            bubbles: !1,
            cancelable: !0,
            detail: n
        });
    t && i.addEventListener(e, t, {
        once: !0
    }), r ? s(i, a) : i.dispatchEvent(a)
}
h(O, `handleAndDispatchCustomEvent`);
var k = x,
    A = S,
    j = e(r(), 1),
    M = Object.defineProperty,
    N = l.forwardRef(((e, t) => M(e, `name`, {
        value: t,
        configurable: !0
    }))(function(e, t) {
        let {
            container: n,
            ...r
        } = e, [i, o] = l.useState(!1);
        a(() => o(!0), []);
        let s = n || i && globalThis ?.document ?.body;
        return s ? j.createPortal((0, p.jsx)(c.div, { ...r,
            ref: t
        }), s) : null
    }, `Portal`)),
    P = Object.defineProperty,
    F = (e, t) => P(e, `name`, {
        value: t,
        configurable: !0
    });

function I(e, t) {
    return l.useReducer((e, n) => t[e][n] ?? e, e)
}
F(I, `useStateMachine`);
var L = F(e => {
    let {
        present: t,
        children: n
    } = e, r = R(t), i = typeof n == `function` ? n({
        present: r.isPresent
    }) : l.Children.only(n), a = B(r.ref, H(i));
    return typeof n == `function` || r.isPresent ? l.cloneElement(i, {
        ref: a
    }) : null
}, `Presence`);

function R(e) {
    let [t, n] = l.useState(), r = l.useRef(null), i = l.useRef(e), o = l.useRef(`none`), s = l.useRef(void 0), [c, u] = I(e ? `mounted` : `unmounted`, {
        mounted: {
            UNMOUNT: `unmounted`,
            ANIMATION_OUT: `unmountSuspended`
        },
        unmountSuspended: {
            MOUNT: `mounted`,
            ANIMATION_END: `unmounted`
        },
        unmounted: {
            MOUNT: `mounted`
        }
    });
    return l.useEffect(() => {
        c === `mounted` ? (o.current = s.current ?? V(r.current), s.current = void 0) : o.current = `none`
    }, [c]), a(() => {
        let t = r.current,
            n = i.current;
        if (n !== e) {
            let r = o.current,
                a = V(t);
            e ? (s.current = a, u(`MOUNT`)) : a === `none` || t ?.display === `none` ? u(`UNMOUNT`) : u(n && r !== a ? `ANIMATION_OUT` : `UNMOUNT`), i.current = e
        }
    }, [e, u]), a(() => {
        if (t) {
            let e, n = t.ownerDocument.defaultView ?? window,
                a = F(a => {
                    let o = V(r.current).includes(CSS.escape(a.animationName));
                    if (a.target === t && o && (u(`ANIMATION_END`), !i.current)) {
                        let r = t.style.animationFillMode;
                        t.style.animationFillMode = `forwards`, e = n.setTimeout(() => {
                            t.style.animationFillMode === `forwards` && (t.style.animationFillMode = r)
                        })
                    }
                }, `handleAnimationEnd`),
                s = F(e => {
                    e.target === t && (o.current = V(r.current))
                }, `handleAnimationStart`);
            return t.addEventListener(`animationstart`, s), t.addEventListener(`animationcancel`, a), t.addEventListener(`animationend`, a), () => {
                n.clearTimeout(e), t.removeEventListener(`animationstart`, s), t.removeEventListener(`animationcancel`, a), t.removeEventListener(`animationend`, a)
            }
        }
        u(`ANIMATION_END`)
    }, [t, u]), {
        isPresent: [`mounted`, `unmountSuspended`].includes(c),
        ref: l.useCallback(e => {
            if (e) {
                let t = getComputedStyle(e);
                r.current = t, s.current = V(t)
            } else r.current = null;
            n(e)
        }, [])
    }
}
F(R, `usePresence`);

function z(e, t) {
    if (typeof e == `function`) return e(t);
    e != null && (e.current = t)
}
F(z, `setRef`);

function B(...e) {
    let t = l.useRef(e);
    return t.current = e, l.useCallback(e => {
        let n = t.current,
            r = !1,
            i = n.map(t => {
                let n = z(t, e);
                return !r && typeof n == `function` && (r = !0), n
            });
        if (r) return () => {
            for (let e = 0; e < i.length; e++) {
                let t = i[e];
                typeof t == `function` ? t() : z(n[e], null)
            }
        }
    }, [])
}
F(B, `useStableComposedRefs`);

function V(e) {
    return e ?.animationName || `none`
}
F(V, `getAnimationName`);

function H(e) {
    let t = Object.getOwnPropertyDescriptor(e.props, `ref`) ?.get,
        n = t && `isReactWarning` in t && t.isReactWarning;
    return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, `ref`) ?.get, n = t && `isReactWarning` in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref)
}
F(H, `getElementRef`);
export {
    k as a, x as i, N as n, C as o, A as r, f as s, L as t
};