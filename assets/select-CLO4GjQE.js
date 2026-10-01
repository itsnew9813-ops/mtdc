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
    n as a,
    r as o,
    t as s
} from "./dist-CICBZQnc.js";
import {
    a as c,
    r as l
} from "./dist-B-uvUq6S.js";
import {
    c as u,
    i as d,
    n as f,
    o as p,
    r as m,
    t as h
} from "./dist-Dfs--0A0.js";
import {
    t as g
} from "./dist-BSxqYw3U.js";
import {
    i as _,
    n as v,
    s as y,
    t as b
} from "./dist-DoLknpjQ.js";
import {
    t as x
} from "./utils-DojpP95n.js";
import {
    t as S
} from "./check-ywTr2UK0.js";
import {
    n as C,
    t as w
} from "./chevron-up-xhe2r3JA.js";
import {
    a as T,
    i as E,
    n as ee,
    r as D,
    t as O
} from "./es2015-DjjQb2_H.js";
var k = e(t(), 1),
    A = e(r(), 1),
    j = Object.defineProperty,
    te = (e, t) => j(e, `name`, {
        value: t,
        configurable: !0
    });

function M(e, [t, n]) {
    return Math.min(n, Math.max(t, e))
}
te(M, `clamp`);
var N = n(),
    P = Object.defineProperty,
    F = (e, t) => P(e, `name`, {
        value: t,
        configurable: !0
    }),
    I = k.createContext(void 0);

function ne(e) {
    let t = k.useContext(I);
    return e || t || `ltr`
}
F(ne, `useDirection`);
var L = Object.defineProperty,
    R = (e, t) => L(e, `name`, {
        value: t,
        configurable: !0
    });

function z(e) {
    let t = k.useRef({
        value: e,
        previous: e
    });
    return k.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e])
}
R(z, `usePrevious`);
var B = Object.defineProperty,
    V = (e, t) => B(e, `name`, {
        value: t,
        configurable: !0
    }),
    H = [` `, `Enter`, `ArrowUp`, `ArrowDown`],
    re = [` `, `Enter`],
    U = `Select`,
    [W, G, ie] = u(U),
    [K, ae] = o(U, [ie, d]),
    q = d(),
    [oe, J] = K(U),
    [se, ce] = K(U);

function le(e) {
    let {
        __scopeSelect: t,
        children: n,
        open: r,
        defaultOpen: i,
        onOpenChange: a,
        value: o,
        defaultValue: c,
        onValueChange: l,
        dir: u,
        name: d,
        autoComplete: f,
        disabled: p,
        required: h,
        form: g,
        internal_do_not_use_render: _
    } = e, v = q(t), [y, b] = k.useState(null), [x, S] = k.useState(null), [C, w] = k.useState(!1), E = ne(u), [ee, D] = s({
        prop: r,
        defaultProp: i ?? !1,
        onChange: a,
        caller: U
    }), [O, A] = s({
        prop: o,
        defaultProp: c,
        onChange: l,
        caller: U
    }), j = k.useRef(null), te = k.useRef(O);
    k.useEffect(() => {
        let e = g ? y ?.ownerDocument.getElementById(g) : y ?.form;
        if (e instanceof HTMLFormElement) {
            let t = V(() => A(te.current), `reset`);
            return e.addEventListener(`reset`, t), () => e.removeEventListener(`reset`, t)
        }
    }, [g, y, A]);
    let M = !y || !!g || !!y.closest(`form`),
        [P, F] = k.useState(new Set),
        I = T(),
        L = Array.from(P).map(e => e.props.value).join(`;`),
        R = k.useCallback(e => {
            F(t => new Set(t).add(e))
        }, []),
        z = k.useCallback(e => {
            F(t => {
                let n = new Set(t);
                return n.delete(e), n
            })
        }, []),
        B = {
            required: h,
            trigger: y,
            onTriggerChange: b,
            valueNode: x,
            onValueNodeChange: S,
            valueNodeHasChildren: C,
            onValueNodeHasChildrenChange: w,
            contentId: I,
            value: O,
            onValueChange: A,
            open: ee,
            onOpenChange: D,
            dir: E,
            triggerPointerDownPosRef: j,
            disabled: p,
            name: d,
            autoComplete: f,
            form: g,
            nativeOptions: P,
            nativeSelectKey: L,
            isFormControl: M
        };
    return (0, N.jsx)(m, { ...v,
        children: (0, N.jsx)(oe, {
            scope: t,
            ...B,
            children: (0, N.jsx)(W.Provider, {
                scope: t,
                children: (0, N.jsx)(se, {
                    scope: t,
                    onNativeOptionAdd: R,
                    onNativeOptionRemove: z,
                    children: Ye(_) ? _(B) : n
                })
            })
        })
    })
}
V(le, `SelectProvider`);
var ue = V(e => {
        let {
            __scopeSelect: t,
            children: n,
            ...r
        } = e;
        return (0, N.jsx)(le, {
            __scopeSelect: t,
            ...r,
            internal_do_not_use_render: ({
                isFormControl: e
            }) => (0, N.jsxs)(N.Fragment, {
                children: [n, e ? (0, N.jsx)(Je, {
                    __scopeSelect: t
                }) : null]
            })
        })
    }, `Select`),
    de = `SelectTrigger`,
    fe = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            disabled: r = !1,
            ...a
        } = e, o = q(n), s = J(de, n), l = s.disabled || r, u = c(t, s.onTriggerChange), d = G(n), f = k.useRef(`touch`), [p, m, _] = Xe(e => {
            let t = d().filter(e => !e.disabled),
                n = Ze(t, e, t.find(e => e.value === s.value));
            n !== void 0 && s.onValueChange(n.value)
        }), v = V(e => {
            l || (s.onOpenChange(!0), _()), e && (s.triggerPointerDownPosRef.current = {
                x: Math.round(e.pageX),
                y: Math.round(e.pageY)
            })
        }, `handleOpen`);
        return (0, N.jsx)(h, {
            asChild: !0,
            ...o,
            children: (0, N.jsx)(g.button, {
                type: `button`,
                role: `combobox`,
                "aria-controls": s.open ? s.contentId : void 0,
                "aria-expanded": s.open,
                "aria-required": s.required,
                "aria-autocomplete": `none`,
                dir: s.dir,
                "data-state": s.open ? `open` : `closed`,
                disabled: l,
                "data-disabled": l ? `` : void 0,
                "data-placeholder": $(s.value) ? `` : void 0,
                ...a,
                ref: u,
                onClick: i(a.onClick, e => {
                    e.currentTarget.focus(), f.current !== `mouse` && v(e)
                }),
                onPointerDown: i(a.onPointerDown, e => {
                    f.current = e.pointerType;
                    let t = e.target;
                    t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), e.button === 0 && e.ctrlKey === !1 && e.pointerType === `mouse` && (v(e), e.preventDefault())
                }),
                onKeyDown: i(a.onKeyDown, e => {
                    let t = p.current !== ``;
                    !(e.ctrlKey || e.altKey || e.metaKey) && e.key.length === 1 && m(e.key), !(t && e.key === ` `) && H.includes(e.key) && (v(), e.preventDefault())
                })
            })
        })
    }, `SelectTrigger`)),
    pe = `SelectValue`,
    me = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            className: r,
            style: i,
            children: o,
            placeholder: s = ``,
            ...l
        } = e, u = J(pe, n), {
            onValueNodeHasChildrenChange: d
        } = u, f = o !== void 0, p = c(t, u.onValueNodeChange);
        a(() => {
            d(f)
        }, [d, f]);
        let m = $(u.value);
        return (0, N.jsx)(g.span, { ...l,
            asChild: !m && l.asChild,
            ref: p,
            style: {
                pointerEvents: `none`
            },
            children: (0, N.jsx)(k.Fragment, {
                children: m ? s : o
            }, m ? `placeholder` : `value`)
        })
    }, `SelectValue`)),
    he = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            children: r,
            ...i
        } = e;
        return (0, N.jsx)(g.span, {
            "aria-hidden": !0,
            ...i,
            ref: t,
            children: r || `▼`
        })
    }, `SelectIcon`)),
    [ge, _e] = K(`SelectPortal`, {
        forceMount: void 0
    }),
    ve = V(e => {
        let {
            __scopeSelect: t,
            forceMount: n,
            ...r
        } = e;
        return (0, N.jsx)(ge, {
            scope: e.__scopeSelect,
            forceMount: n,
            children: (0, N.jsx)(v, {
                asChild: !0,
                ...r
            })
        })
    }, `SelectPortal`),
    Y = `SelectContent`,
    ye = k.forwardRef(V(function(e, t) {
        let n = _e(Y, e.__scopeSelect),
            {
                forceMount: r = n.forceMount,
                ...i
            } = e,
            o = J(Y, e.__scopeSelect),
            [s, c] = k.useState();
        return a(() => {
            c(new DocumentFragment)
        }, []), (0, N.jsx)(b, {
            present: r || o.open,
            children: ({
                present: e
            }) => e ? (0, N.jsx)(Ce, { ...i,
                ref: t
            }) : (0, N.jsx)(be, { ...i,
                fragment: s
            })
        })
    }, `SelectContent`)),
    be = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            children: r,
            fragment: i
        } = e;
        return i ? A.createPortal((0, N.jsx)(xe, {
            scope: n,
            children: (0, N.jsx)(W.Slot, {
                scope: n,
                children: (0, N.jsx)(`div`, {
                    ref: t,
                    children: r
                })
            })
        }), i) : null
    }, `SelectContentFragment`)),
    X = 10,
    [xe, Z] = K(Y),
    Se = l(`SelectContent.RemoveScroll`),
    Ce = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n
        } = e, {
            position: r = `item-aligned`,
            onCloseAutoFocus: a,
            onEscapeKeyDown: o,
            onPointerDownOutside: s,
            side: l,
            sideOffset: u,
            align: d,
            alignOffset: f,
            arrowPadding: p,
            collisionBoundary: m,
            collisionPadding: h,
            sticky: g,
            hideWhenDetached: v,
            avoidCollisions: y,
            ...b
        } = e, x = J(Y, n), [S, C] = k.useState(null), [w, T] = k.useState(null), A = c(t, C), [j, te] = k.useState(null), [M, P] = k.useState(null), F = G(n), [I, ne] = k.useState(!1), L = k.useRef(!1);
        k.useEffect(() => {
            if (S) return O(S)
        }, [S]), D();
        let R = k.useCallback(e => {
                let [t, ...n] = F().map(e => e.ref.current), [r] = n.slice(-1), i = document.activeElement;
                for (let n of e)
                    if (n === i || (n ?.scrollIntoView({
                            block: `nearest`
                        }), n === t && w && (w.scrollTop = 0), n === r && w && (w.scrollTop = w.scrollHeight), n ?.focus(), document.activeElement !== i)) return
            }, [F, w]),
            z = k.useCallback(() => R([j, S]), [R, j, S]);
        k.useEffect(() => {
            I && z()
        }, [I, z]);
        let {
            onOpenChange: B,
            triggerPointerDownPosRef: H
        } = x;
        k.useEffect(() => {
            if (S) {
                let e = {
                        x: 0,
                        y: 0
                    },
                    t = V(t => {
                        e = {
                            x: Math.abs(Math.round(t.pageX) - (H.current ?.x ?? 0)),
                            y: Math.abs(Math.round(t.pageY) - (H.current ?.y ?? 0))
                        }
                    }, `handlePointerMove`),
                    n = V(n => {
                        e.x <= 10 && e.y <= 10 ? n.preventDefault() : n.composedPath().includes(S) || B(!1), document.removeEventListener(`pointermove`, t), H.current = null
                    }, `handlePointerUp`);
                return H.current !== null && (document.addEventListener(`pointermove`, t), document.addEventListener(`pointerup`, n, {
                    capture: !0,
                    once: !0
                })), () => {
                    document.removeEventListener(`pointermove`, t), document.removeEventListener(`pointerup`, n, {
                        capture: !0
                    })
                }
            }
        }, [S, B, H]), k.useEffect(() => {
            let e = V(() => B(!1), `close`);
            return window.addEventListener(`blur`, e), window.addEventListener(`resize`, e), () => {
                window.removeEventListener(`blur`, e), window.removeEventListener(`resize`, e)
            }
        }, [B]);
        let [re, U] = Xe(e => {
            let t = F().filter(e => !e.disabled),
                n = Ze(t, e, t.find(e => e.ref.current === document.activeElement));
            n && setTimeout(() => n.ref.current ?.focus())
        }), W = k.useCallback((e, t, n) => {
            let r = !L.current && !n;
            (x.value !== void 0 && x.value === t || r) && (te(e), r && (L.current = !0))
        }, [x.value]), ie = k.useCallback(() => S ?.focus(), [S]), K = k.useCallback((e, t, n) => {
            let r = !L.current && !n;
            (x.value !== void 0 && x.value === t || r) && P(e)
        }, [x.value]), ae = r === `popper` ? Te : we, q = ae === Te ? {
            side: l,
            sideOffset: u,
            align: d,
            alignOffset: f,
            arrowPadding: p,
            collisionBoundary: m,
            collisionPadding: h,
            sticky: g,
            hideWhenDetached: v,
            avoidCollisions: y
        } : {};
        return (0, N.jsx)(xe, {
            scope: n,
            content: S,
            viewport: w,
            onViewportChange: T,
            itemRefCallback: W,
            selectedItem: j,
            onItemLeave: ie,
            itemTextRefCallback: K,
            focusSelectedItem: z,
            selectedItemText: M,
            position: r,
            isPositioned: I,
            searchRef: re,
            children: (0, N.jsx)(ee, {
                as: Se,
                allowPinchZoom: !0,
                children: (0, N.jsx)(E, {
                    asChild: !0,
                    trapped: x.open,
                    onMountAutoFocus: e => {
                        e.preventDefault()
                    },
                    onUnmountAutoFocus: i(a, e => {
                        x.trigger ?.focus({
                            preventScroll: !0
                        }), e.preventDefault()
                    }),
                    children: (0, N.jsx)(_, {
                        asChild: !0,
                        disableOutsidePointerEvents: !0,
                        onEscapeKeyDown: o,
                        onPointerDownOutside: s,
                        onFocusOutside: e => e.preventDefault(),
                        onDismiss: () => x.onOpenChange(!1),
                        children: (0, N.jsx)(ae, {
                            role: `listbox`,
                            id: x.contentId,
                            "data-state": x.open ? `open` : `closed`,
                            dir: x.dir,
                            onContextMenu: e => e.preventDefault(),
                            ...b,
                            ...q,
                            onPlaced: () => ne(!0),
                            ref: A,
                            style: {
                                display: `flex`,
                                flexDirection: `column`,
                                outline: `none`,
                                ...b.style
                            },
                            onKeyDown: i(b.onKeyDown, e => {
                                let t = e.ctrlKey || e.altKey || e.metaKey;
                                if (e.key === `Tab` && e.preventDefault(), !t && e.key.length === 1 && U(e.key), [`ArrowUp`, `ArrowDown`, `Home`, `End`].includes(e.key)) {
                                    let t = F().filter(e => !e.disabled).map(e => e.ref.current);
                                    if ([`ArrowUp`, `End`].includes(e.key) && (t = t.slice().reverse()), [`ArrowUp`, `ArrowDown`].includes(e.key)) {
                                        let n = e.target,
                                            r = t.indexOf(n);
                                        t = t.slice(r + 1)
                                    }
                                    setTimeout(() => R(t)), e.preventDefault()
                                }
                            })
                        })
                    })
                })
            })
        })
    }, `SelectContentImpl`)),
    we = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            onPlaced: r,
            ...i
        } = e, o = J(Y, n), s = Z(Y, n), [l, u] = k.useState(null), [d, f] = k.useState(null), p = c(t, f), m = G(n), h = k.useRef(!1), _ = k.useRef(!0), {
            viewport: v,
            selectedItem: y,
            selectedItemText: b,
            focusSelectedItem: x
        } = s, S = k.useCallback(() => {
            if (o.trigger && o.valueNode && l && d && v && y && b) {
                let e = o.trigger.getBoundingClientRect(),
                    t = d.getBoundingClientRect(),
                    n = o.valueNode.getBoundingClientRect(),
                    i = b.getBoundingClientRect();
                if (o.dir !== `rtl`) {
                    let r = i.left - t.left,
                        a = n.left - r,
                        o = e.left - a,
                        s = e.width + o,
                        c = Math.max(s, t.width),
                        u = window.innerWidth - X,
                        d = M(a, [X, Math.max(X, u - c)]);
                    l.style.minWidth = s + `px`, l.style.left = d + `px`
                } else {
                    let r = t.right - i.right,
                        a = window.innerWidth - n.right - r,
                        o = window.innerWidth - e.right - a,
                        s = e.width + o,
                        c = Math.max(s, t.width),
                        u = window.innerWidth - X,
                        d = M(a, [X, Math.max(X, u - c)]);
                    l.style.minWidth = s + `px`, l.style.right = d + `px`
                }
                let a = m(),
                    s = window.innerHeight - X * 2,
                    c = v.scrollHeight,
                    u = window.getComputedStyle(d),
                    f = parseInt(u.borderTopWidth, 10),
                    p = parseInt(u.paddingTop, 10),
                    g = parseInt(u.borderBottomWidth, 10),
                    _ = parseInt(u.paddingBottom, 10),
                    x = f + p + c + _ + g,
                    S = Math.min(y.offsetHeight * 5, x),
                    C = window.getComputedStyle(v),
                    w = parseInt(C.paddingTop, 10),
                    T = parseInt(C.paddingBottom, 10),
                    E = e.top + e.height / 2 - X,
                    ee = s - E,
                    D = y.offsetHeight / 2,
                    O = y.offsetTop + D,
                    k = f + p + O,
                    A = x - k;
                if (k <= E) {
                    let e = a.length > 0 && y === a[a.length - 1].ref.current;
                    l.style.bottom = `0px`;
                    let t = d.clientHeight - v.offsetTop - v.offsetHeight,
                        n = k + Math.max(ee, D + (e ? T : 0) + t + g);
                    l.style.height = n + `px`
                } else {
                    let e = a.length > 0 && y === a[0].ref.current;
                    l.style.top = `0px`;
                    let t = Math.max(E, f + v.offsetTop + (e ? w : 0) + D) + A;
                    l.style.height = t + `px`, v.scrollTop = k - E + v.offsetTop
                }
                l.style.margin = `${X}px 0`, l.style.minHeight = S + `px`, l.style.maxHeight = s + `px`, r ?.(), requestAnimationFrame(() => h.current = !0)
            }
        }, [m, o.trigger, o.valueNode, l, d, v, y, b, o.dir, r]);
        a(() => S(), [S]);
        let [C, w] = k.useState();
        a(() => {
            d && w(window.getComputedStyle(d).zIndex)
        }, [d]);
        let T = k.useCallback(e => {
            e && _.current === !0 && (S(), x ?.(), _.current = !1)
        }, [S, x]);
        return (0, N.jsx)(Ee, {
            scope: n,
            contentWrapper: l,
            shouldExpandOnScrollRef: h,
            onScrollButtonChange: T,
            children: (0, N.jsx)(`div`, {
                ref: u,
                style: {
                    display: `flex`,
                    flexDirection: `column`,
                    position: `fixed`,
                    zIndex: C
                },
                children: (0, N.jsx)(g.div, { ...i,
                    ref: p,
                    style: {
                        boxSizing: `border-box`,
                        maxHeight: `100%`,
                        ...i.style
                    }
                })
            })
        })
    }, `SelectItemAlignedPosition`)),
    Te = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            align: r = `start`,
            collisionPadding: i = X,
            ...a
        } = e, o = q(n);
        return (0, N.jsx)(f, { ...o,
            ...a,
            ref: t,
            align: r,
            collisionPadding: i,
            style: {
                boxSizing: `border-box`,
                ...a.style,
                "--radix-select-content-transform-origin": `var(--radix-popper-transform-origin)`,
                "--radix-select-content-available-width": `var(--radix-popper-available-width)`,
                "--radix-select-content-available-height": `var(--radix-popper-available-height)`,
                "--radix-select-trigger-width": `var(--radix-popper-anchor-width)`,
                "--radix-select-trigger-height": `var(--radix-popper-anchor-height)`
            }
        })
    }, `SelectPopperPosition`)),
    [Ee, De] = K(Y, {}),
    Oe = `SelectViewport`,
    ke = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            nonce: r,
            ...a
        } = e, o = Z(Oe, n), s = De(Oe, n), l = c(t, o.onViewportChange), u = k.useRef(0);
        return (0, N.jsxs)(N.Fragment, {
            children: [(0, N.jsx)(`style`, {
                dangerouslySetInnerHTML: {
                    __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
                },
                nonce: r
            }), (0, N.jsx)(W.Slot, {
                scope: n,
                children: (0, N.jsx)(g.div, {
                    "data-radix-select-viewport": ``,
                    role: `presentation`,
                    ...a,
                    ref: l,
                    style: {
                        position: `relative`,
                        flex: 1,
                        overflow: `hidden auto`,
                        ...a.style
                    },
                    onScroll: i(a.onScroll, e => {
                        let t = e.currentTarget,
                            {
                                contentWrapper: n,
                                shouldExpandOnScrollRef: r
                            } = s;
                        if (r ?.current && n) {
                            let e = Math.abs(u.current - t.scrollTop);
                            if (e > 0) {
                                let r = window.innerHeight - X * 2,
                                    i = parseFloat(n.style.minHeight),
                                    a = parseFloat(n.style.height),
                                    o = Math.max(i, a);
                                if (o < r) {
                                    let i = o + e,
                                        a = Math.min(r, i),
                                        s = i - a;
                                    n.style.height = a + `px`, n.style.bottom === `0px` && (t.scrollTop = s > 0 ? s : 0, n.style.justifyContent = `flex-end`)
                                }
                            }
                        }
                        u.current = t.scrollTop
                    })
                })
            })]
        })
    }, `SelectViewport`)),
    [Ae, je] = K(`SelectGroup`),
    Me = `SelectLabel`,
    Ne = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            ...r
        } = e, i = je(Me, n);
        return (0, N.jsx)(g.div, {
            id: i.id,
            ...r,
            ref: t
        })
    }, `SelectLabel`)),
    Pe = `SelectItem`,
    [Fe, Ie] = K(Pe),
    Le = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            value: r,
            disabled: a = !1,
            textValue: o,
            ...s
        } = e, l = J(Pe, n), u = Z(Pe, n), d = l.value === r, [f, p] = k.useState(o ?? ``), [m, h] = k.useState(!1), _ = y(e => u.itemRefCallback ?.(e, r, a)), v = c(t, _), b = T(), x = k.useRef(`touch`), S = V(() => {
            a || (l.onValueChange(r), l.onOpenChange(!1))
        }, `handleSelect`);
        return (0, N.jsx)(Fe, {
            scope: n,
            value: r,
            disabled: a,
            textId: b,
            isSelected: d,
            onItemTextChange: k.useCallback(e => {
                p(t => t || (e ?.textContent ?? ``).trim())
            }, []),
            children: (0, N.jsx)(W.ItemSlot, {
                scope: n,
                value: r,
                disabled: a,
                textValue: f,
                children: (0, N.jsx)(g.div, {
                    role: `option`,
                    "aria-labelledby": b,
                    "data-highlighted": m ? `` : void 0,
                    "aria-selected": d && m,
                    "data-state": d ? `checked` : `unchecked`,
                    "aria-disabled": a || void 0,
                    "data-disabled": a ? `` : void 0,
                    tabIndex: a ? void 0 : -1,
                    ...s,
                    ref: v,
                    onFocus: i(s.onFocus, () => h(!0)),
                    onBlur: i(s.onBlur, () => h(!1)),
                    onClick: i(s.onClick, () => {
                        x.current !== `mouse` && S()
                    }),
                    onPointerUp: i(s.onPointerUp, () => {
                        x.current === `mouse` && S()
                    }),
                    onPointerDown: i(s.onPointerDown, e => {
                        x.current = e.pointerType
                    }),
                    onPointerMove: i(s.onPointerMove, e => {
                        x.current = e.pointerType, a ? u.onItemLeave ?.() : x.current === `mouse` && e.currentTarget.focus({
                            preventScroll: !0
                        })
                    }),
                    onPointerLeave: i(s.onPointerLeave, e => {
                        e.currentTarget === document.activeElement && u.onItemLeave ?.()
                    }),
                    onKeyDown: i(s.onKeyDown, e => {
                        a || e.target !== e.currentTarget || (u.searchRef ?.current === `` || e.key !== ` `) && (re.includes(e.key) && S(), e.key === ` ` && e.preventDefault())
                    })
                })
            })
        })
    }, `SelectItem`)),
    Q = `SelectItemText`,
    Re = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            className: r,
            style: i,
            ...o
        } = e, s = J(Q, n), l = Z(Q, n), u = Ie(Q, n), d = ce(Q, n), [f, p] = k.useState(null), m = y(e => l.itemTextRefCallback ?.(e, u.value, u.disabled)), h = c(t, p, u.onItemTextChange, m), _ = f ?.textContent, v = k.useMemo(() => (0, N.jsx)(`option`, {
            value: u.value,
            disabled: u.disabled,
            children: _
        }, u.value), [u.disabled, u.value, _]), {
            onNativeOptionAdd: b,
            onNativeOptionRemove: x
        } = d;
        return a(() => (b(v), () => x(v)), [b, x, v]), (0, N.jsxs)(N.Fragment, {
            children: [(0, N.jsx)(g.span, {
                id: u.textId,
                ...o,
                ref: h
            }), u.isSelected && s.valueNode && !s.valueNodeHasChildren && !$(s.value) ? A.createPortal(o.children, s.valueNode) : null]
        })
    }, `SelectItemText`)),
    ze = `SelectItemIndicator`,
    Be = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            ...r
        } = e;
        return Ie(ze, n).isSelected ? (0, N.jsx)(g.span, {
            "aria-hidden": !0,
            ...r,
            ref: t
        }) : null
    }, `SelectItemIndicator`)),
    Ve = `SelectScrollUpButton`,
    He = k.forwardRef(V(function(e, t) {
        let n = Z(Ve, e.__scopeSelect),
            r = De(Ve, e.__scopeSelect),
            [i, o] = k.useState(!1),
            s = c(t, r.onScrollButtonChange);
        return a(() => {
            if (n.viewport && n.isPositioned) {
                let e = function() {
                    let e = t.scrollTop > 0;
                    o(e)
                };
                V(e, `handleScroll`);
                let t = n.viewport;
                return e(), t.addEventListener(`scroll`, e), () => t.removeEventListener(`scroll`, e)
            }
        }, [n.viewport, n.isPositioned]), i ? (0, N.jsx)(Ge, { ...e,
            ref: s,
            onAutoScroll: () => {
                let {
                    viewport: e,
                    selectedItem: t
                } = n;
                e && t && (e.scrollTop -= t.offsetHeight)
            }
        }) : null
    }, `SelectScrollUpButton`)),
    Ue = `SelectScrollDownButton`,
    We = k.forwardRef(V(function(e, t) {
        let n = Z(Ue, e.__scopeSelect),
            r = De(Ue, e.__scopeSelect),
            [i, o] = k.useState(!1),
            s = c(t, r.onScrollButtonChange);
        return a(() => {
            if (n.viewport && n.isPositioned) {
                let e = function() {
                    let e = t.scrollHeight - t.clientHeight,
                        n = Math.ceil(t.scrollTop) < e;
                    o(n)
                };
                V(e, `handleScroll`);
                let t = n.viewport;
                return e(), t.addEventListener(`scroll`, e), () => t.removeEventListener(`scroll`, e)
            }
        }, [n.viewport, n.isPositioned]), i ? (0, N.jsx)(Ge, { ...e,
            ref: s,
            onAutoScroll: () => {
                let {
                    viewport: e,
                    selectedItem: t
                } = n;
                e && t && (e.scrollTop += t.offsetHeight)
            }
        }) : null
    }, `SelectScrollDownButton`)),
    Ge = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            onAutoScroll: r,
            ...o
        } = e, s = Z(`SelectScrollButton`, n), c = k.useRef(null), l = G(n), u = k.useCallback(() => {
            c.current !== null && (window.clearInterval(c.current), c.current = null)
        }, []);
        return k.useEffect(() => () => u(), [u]), a(() => {
            l().find(e => e.ref.current === document.activeElement) ?.ref.current ?.scrollIntoView({
                block: `nearest`
            })
        }, [l]), (0, N.jsx)(g.div, {
            "aria-hidden": !0,
            ...o,
            ref: t,
            style: {
                flexShrink: 0,
                ...o.style
            },
            onPointerDown: i(o.onPointerDown, () => {
                c.current === null && (c.current = window.setInterval(r, 50))
            }),
            onPointerMove: i(o.onPointerMove, () => {
                s.onItemLeave ?.(), c.current === null && (c.current = window.setInterval(r, 50))
            }),
            onPointerLeave: i(o.onPointerLeave, () => {
                u()
            })
        })
    }, `SelectScrollButtonImpl`)),
    Ke = k.forwardRef(V(function(e, t) {
        let {
            __scopeSelect: n,
            ...r
        } = e;
        return (0, N.jsx)(g.div, {
            "aria-hidden": !0,
            ...r,
            ref: t
        })
    }, `SelectSeparator`)),
    qe = `SelectBubbleInput`,
    Je = k.forwardRef(V(function({
        __scopeSelect: e,
        ...t
    }, n) {
        let r = J(qe, e),
            {
                value: i,
                onValueChange: a,
                required: o,
                disabled: s,
                name: l,
                autoComplete: u,
                form: d
            } = r,
            {
                nativeOptions: f,
                nativeSelectKey: m
            } = r,
            h = k.useRef(null),
            _ = c(n, h),
            v = i ?? ``,
            y = z(v),
            b = Array.from(f).some(e => (e.props.value ?? ``) === ``);
        return k.useEffect(() => {
            let e = h.current;
            if (!e) return;
            let t = window.HTMLSelectElement.prototype,
                n = Object.getOwnPropertyDescriptor(t, `value`).set;
            if (y !== v && n) {
                let t = new Event(`change`, {
                    bubbles: !0
                });
                n.call(e, v), e.dispatchEvent(t)
            }
        }, [y, v]), (0, N.jsxs)(g.select, {
            "aria-hidden": !0,
            required: o,
            tabIndex: -1,
            name: l,
            autoComplete: u,
            disabled: s,
            form: d,
            onChange: e => a(e.target.value),
            ...t,
            style: { ...p,
                ...t.style
            },
            ref: _,
            defaultValue: v,
            children: [$(i) && !b ? (0, N.jsx)(`option`, {
                value: ``
            }) : null, Array.from(f)]
        }, m)
    }, `SelectBubbleInput`));

function Ye(e) {
    return typeof e == `function`
}
V(Ye, `isFunction`);

function $(e) {
    return e === `` || e === void 0
}
V($, `shouldShowPlaceholder`);

function Xe(e) {
    let t = y(e),
        n = k.useRef(``),
        r = k.useRef(0),
        i = k.useCallback(e => {
            let i = n.current + e;
            t(i), V((function e(t) {
                n.current = t, window.clearTimeout(r.current), t !== `` && (r.current = window.setTimeout(() => e(``), 1e3))
            }), `updateSearch`)(i)
        }, [t]),
        a = k.useCallback(() => {
            n.current = ``, window.clearTimeout(r.current)
        }, []);
    return k.useEffect(() => () => window.clearTimeout(r.current), []), [n, i, a]
}
V(Xe, `useTypeaheadSearch`);

function Ze(e, t, n) {
    let r = t.length > 1 && Array.from(t).every(e => e === t[0]) ? t[0] : t,
        i = n ? e.indexOf(n) : -1,
        a = Qe(e, Math.max(i, 0));
    r.length === 1 && (a = a.filter(e => e !== n));
    let o = a.find(e => e.textValue.toLowerCase().startsWith(r.toLowerCase()));
    return o === n ? void 0 : o
}
V(Ze, `findNextItem`);

function Qe(e, t) {
    return e.map((n, r) => e[(t + r) % e.length])
}
V(Qe, `wrapArray`);
var $e = ue,
    et = me,
    tt = k.forwardRef(({
        className: e,
        children: t,
        ...n
    }, r) => (0, N.jsxs)(fe, {
        ref: r,
        className: x(`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1`, e),
        ...n,
        children: [t, (0, N.jsx)(he, {
            asChild: !0,
            children: (0, N.jsx)(C, {
                className: `h-4 w-4 opacity-50`
            })
        })]
    }));
tt.displayName = fe.displayName;
var nt = k.forwardRef(({
    className: e,
    ...t
}, n) => (0, N.jsx)(He, {
    ref: n,
    className: x(`flex cursor-default items-center justify-center py-1`, e),
    ...t,
    children: (0, N.jsx)(w, {
        className: `h-4 w-4`
    })
}));
nt.displayName = He.displayName;
var rt = k.forwardRef(({
    className: e,
    ...t
}, n) => (0, N.jsx)(We, {
    ref: n,
    className: x(`flex cursor-default items-center justify-center py-1`, e),
    ...t,
    children: (0, N.jsx)(C, {
        className: `h-4 w-4`
    })
}));
rt.displayName = We.displayName;
var it = k.forwardRef(({
    className: e,
    children: t,
    position: n = `popper`,
    ...r
}, i) => (0, N.jsx)(ve, {
    children: (0, N.jsxs)(ye, {
        ref: i,
        className: x(`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`, n === `popper` && `data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1`, e),
        position: n,
        ...r,
        children: [(0, N.jsx)(nt, {}), (0, N.jsx)(ke, {
            className: x(`p-1`, n === `popper` && `h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]`),
            children: t
        }), (0, N.jsx)(rt, {})]
    })
}));
it.displayName = ye.displayName;
var at = k.forwardRef(({
    className: e,
    ...t
}, n) => (0, N.jsx)(Ne, {
    ref: n,
    className: x(`py-1.5 pl-8 pr-2 text-sm font-semibold`, e),
    ...t
}));
at.displayName = Ne.displayName;
var ot = k.forwardRef(({
    className: e,
    children: t,
    ...n
}, r) => (0, N.jsxs)(Le, {
    ref: r,
    className: x(`relative flex w-full cursor-default select-none items-center rounded-xs py-1.5 pl-8 pr-2 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground`, e),
    ...n,
    children: [(0, N.jsx)(`span`, {
        className: `absolute left-2 flex h-3.5 w-3.5 items-center justify-center`,
        children: (0, N.jsx)(Be, {
            children: (0, N.jsx)(S, {
                className: `h-4 w-4`
            })
        })
    }), (0, N.jsx)(Re, {
        children: t
    })]
}));
ot.displayName = Le.displayName;
var st = k.forwardRef(({
    className: e,
    ...t
}, n) => (0, N.jsx)(Ke, {
    ref: n,
    className: x(`-mx-1 my-1 h-px bg-muted`, e),
    ...t
}));
st.displayName = Ke.displayName;
export {
    et as a, tt as i, it as n, ot as r, $e as t
};