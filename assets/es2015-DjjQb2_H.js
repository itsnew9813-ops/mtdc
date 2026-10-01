import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t,
    t as n
} from "./jsx-runtime-DE3RlOCf.js";
import {
    i as r,
    n as i,
    r as a
} from "./client-B0gse2_o.js";
import {
    n as o
} from "./dist-CICBZQnc.js";
import {
    a as s
} from "./dist-B-uvUq6S.js";
import {
    t as c
} from "./dist-BSxqYw3U.js";
import {
    s as l
} from "./dist-DoLknpjQ.js";
var u = e(t(), 1),
    d = Object.defineProperty,
    f = (e, t) => d(e, `name`, {
        value: t,
        configurable: !0
    }),
    p = u.useId || (() => void 0),
    m = 0;

function h(e) {
    let [t, n] = u.useState(p());
    return o(() => {
        e || n(e => e ?? String(m++))
    }, [e]), e || (t ? `radix-${t}` : ``)
}
f(h, `useId`);
var g = n(),
    _ = Object.defineProperty,
    v = (e, t) => _(e, `name`, {
        value: t,
        configurable: !0
    }),
    y = `focusScope.autoFocusOnMount`,
    b = `focusScope.autoFocusOnUnmount`,
    x = {
        bubbles: !1,
        cancelable: !0
    },
    S = u.forwardRef(v(function(e, t) {
        let {
            loop: n = !1,
            trapped: r = !1,
            onMountAutoFocus: i,
            onUnmountAutoFocus: a,
            ...o
        } = e, [d, f] = u.useState(null), p = l(i), m = l(a), h = u.useRef(null), _ = s(t, f), S = u.useRef({
            paused: !1,
            pause() {
                this.paused = !0
            },
            resume() {
                this.paused = !1
            }
        }).current;
        u.useEffect(() => {
            if (r) {
                let e = function(e) {
                        if (S.paused || !d) return;
                        let t = e.target;
                        d.contains(t) ? h.current = t : k(h.current, {
                            select: !0
                        })
                    },
                    t = function(e) {
                        if (S.paused || !d) return;
                        let t = e.relatedTarget;
                        t !== null && (d.contains(t) || k(h.current, {
                            select: !0
                        }))
                    },
                    n = function(e) {
                        if (document.activeElement === document.body)
                            for (let t of e) t.removedNodes.length > 0 && k(d)
                    };
                v(e, `handleFocusIn`), v(t, `handleFocusOut`), v(n, `handleMutations`), document.addEventListener(`focusin`, e), document.addEventListener(`focusout`, t);
                let r = new MutationObserver(n);
                return d && r.observe(d, {
                    childList: !0,
                    subtree: !0
                }), () => {
                    document.removeEventListener(`focusin`, e), document.removeEventListener(`focusout`, t), r.disconnect()
                }
            }
        }, [r, d, S.paused]), u.useEffect(() => {
            if (d) {
                ee.add(S);
                let e = document.activeElement;
                if (!d.contains(e)) {
                    let t = new CustomEvent(y, x);
                    d.addEventListener(y, p), d.dispatchEvent(t), t.defaultPrevented || (C(ne(T(d)), {
                        select: !0
                    }), document.activeElement === e && k(d))
                }
                return () => {
                    d.removeEventListener(y, p), setTimeout(() => {
                        let t = new CustomEvent(b, x);
                        d.addEventListener(b, m), d.dispatchEvent(t), t.defaultPrevented || k(e ?? document.body, {
                            select: !0
                        }), d.removeEventListener(b, m), ee.remove(S)
                    }, 0)
                }
            }
        }, [d, p, m, S]);
        let E = u.useCallback(e => {
            if (!n && !r || S.paused) return;
            let t = e.key === `Tab` && !e.altKey && !e.ctrlKey && !e.metaKey,
                i = document.activeElement;
            if (t && i) {
                let t = e.currentTarget,
                    [r, a] = w(t);
                r && a ? !e.shiftKey && i === a ? (e.preventDefault(), n && k(r, {
                    select: !0
                })) : e.shiftKey && i === r && (e.preventDefault(), n && k(a, {
                    select: !0
                })) : i === t && e.preventDefault()
            }
        }, [n, r, S.paused]);
        return (0, g.jsx)(c.div, {
            tabIndex: -1,
            ...o,
            ref: _,
            onKeyDown: E
        })
    }, `FocusScope`));

function C(e, {
    select: t = !1
} = {}) {
    let n = document.activeElement;
    for (let r of e)
        if (k(r, {
                select: t
            }), document.activeElement !== n) return
}
v(C, `focusFirst`);

function w(e) {
    let t = T(e);
    return [E(t, e), E(t.reverse(), e)]
}
v(w, `getTabbableEdges`);

function T(e) {
    let t = [],
        n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
            acceptNode: v(e => {
                let t = e.tagName === `INPUT` && e.type === `hidden`;
                return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            }, `acceptNode`)
        });
    for (; n.nextNode();) t.push(n.currentNode);
    return t
}
v(T, `getTabbableCandidates`);

function E(e, t) {
    let n = typeof t.checkVisibility == `function` && t.checkVisibility({
        checkVisibilityCSS: !0
    });
    for (let r of e)
        if (!(n ? !r.checkVisibility({
                checkVisibilityCSS: !0
            }) : D(r, {
                upTo: t
            }))) return r
}
v(E, `findVisible`);

function D(e, {
    upTo: t
}) {
    if (getComputedStyle(e).visibility === `hidden`) return !0;
    for (; e;) {
        if (t !== void 0 && e === t) return !1;
        if (getComputedStyle(e).display === `none`) return !0;
        e = e.parentElement
    }
    return !1
}
v(D, `isHidden`);

function O(e) {
    return e instanceof HTMLInputElement && `select` in e
}
v(O, `isSelectableInput`);

function k(e, {
    select: t = !1
} = {}) {
    if (e && e.focus) {
        let n = document.activeElement;
        e.focus({
            preventScroll: !0
        }), e !== n && O(e) && t && e.select()
    }
}
v(k, `focus`);
var ee = te();

function te() {
    let e = [];
    return {
        add(t) {
            let n = e[0];
            t !== n && n ?.pause(), e = A(e, t), e.unshift(t)
        },
        remove(t) {
            e = A(e, t), e[0] ?.resume()
        }
    }
}
v(te, `createFocusScopesStack`);

function A(e, t) {
    let n = [...e],
        r = n.indexOf(t);
    return r !== -1 && n.splice(r, 1), n
}
v(A, `arrayRemove`);

function ne(e) {
    return e.filter(e => e.tagName !== `A`)
}
v(ne, `removeLinks`);
var re = Object.defineProperty,
    j = (e, t) => re(e, `name`, {
        value: t,
        configurable: !0
    }),
    M = 0,
    N = null;

function ie(e) {
    return P(), e.children
}
j(ie, `FocusGuards`);

function P() {
    u.useEffect(() => {
        N ||= {
            start: F(),
            end: F()
        };
        let {
            start: e,
            end: t
        } = N;
        return document.body.firstElementChild !== e && document.body.insertAdjacentElement(`afterbegin`, e), document.body.lastElementChild !== t && document.body.insertAdjacentElement(`beforeend`, t), M++, () => {
            M === 1 && (N ?.start.remove(), N ?.end.remove(), N = null), M = Math.max(0, M - 1)
        }
    }, [])
}
j(P, `useFocusGuards`);

function F() {
    let e = document.createElement(`span`);
    return e.setAttribute(`data-radix-focus-guard`, ``), e.tabIndex = 0, e.style.outline = `none`, e.style.opacity = `0`, e.style.position = `fixed`, e.style.pointerEvents = `none`, e
}
j(F, `createFocusGuard`);
var I = `right-scroll-bar-position`,
    L = `width-before-scroll-bar`,
    ae = `with-scroll-bars-hidden`,
    oe = `--removed-body-scroll-bar-size`;

function R(e, t) {
    return typeof e == `function` ? e(t) : e && (e.current = t), e
}

function se(e, t) {
    var n = (0, u.useState)(function() {
        return {
            value: e,
            callback: t,
            facade: {
                get current() {
                    return n.value
                },
                set current(e) {
                    var t = n.value;
                    t !== e && (n.value = e, n.callback(e, t))
                }
            }
        }
    })[0];
    return n.callback = t, n.facade
}
var ce = typeof window < `u` ? u.useLayoutEffect : u.useEffect,
    z = new WeakMap;

function le(e, t) {
    var n = se(t || null, function(t) {
        return e.forEach(function(e) {
            return R(e, t)
        })
    });
    return ce(function() {
        var t = z.get(n);
        if (t) {
            var r = new Set(t),
                i = new Set(e),
                a = n.current;
            r.forEach(function(e) {
                i.has(e) || R(e, null)
            }), i.forEach(function(e) {
                r.has(e) || R(e, a)
            })
        }
        z.set(n, e)
    }, [e]), n
}

function ue(e) {
    return e
}

function de(e, t) {
    t === void 0 && (t = ue);
    var n = [],
        r = !1;
    return {
        read: function() {
            if (r) throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
            return n.length ? n[n.length - 1] : e
        },
        useMedium: function(e) {
            var i = t(e, r);
            return n.push(i),
                function() {
                    n = n.filter(function(e) {
                        return e !== i
                    })
                }
        },
        assignSyncMedium: function(e) {
            for (r = !0; n.length;) {
                var t = n;
                n = [], t.forEach(e)
            }
            n = {
                push: function(t) {
                    return e(t)
                },
                filter: function() {
                    return n
                }
            }
        },
        assignMedium: function(e) {
            r = !0;
            var t = [];
            if (n.length) {
                var i = n;
                n = [], i.forEach(e), t = n
            }
            var a = function() {
                    var n = t;
                    t = [], n.forEach(e)
                },
                o = function() {
                    return Promise.resolve().then(a)
                };
            o(), n = {
                push: function(e) {
                    t.push(e), o()
                },
                filter: function(e) {
                    return t = t.filter(e), n
                }
            }
        }
    }
}

function fe(e) {
    e === void 0 && (e = {});
    var t = de(null);
    return t.options = i({
        async: !0,
        ssr: !1
    }, e), t
}
var B = function(e) {
    var t = e.sideCar,
        n = a(e, [`sideCar`]);
    if (!t) throw Error("Sidecar: please provide `sideCar` property to import the right car");
    var r = t.read();
    if (!r) throw Error(`Sidecar medium not found`);
    return u.createElement(r, i({}, n))
};
B.isSideCarExport = !0;

function pe(e, t) {
    return e.useMedium(t), B
}
var me = fe(),
    V = function() {},
    H = u.forwardRef(function(e, t) {
        var n = u.useRef(null),
            r = u.useState({
                onScrollCapture: V,
                onWheelCapture: V,
                onTouchMoveCapture: V
            }),
            o = r[0],
            s = r[1],
            c = e.forwardProps,
            l = e.children,
            d = e.className,
            f = e.removeScrollBar,
            p = e.enabled,
            m = e.shards,
            h = e.sideCar,
            g = e.noRelative,
            _ = e.noIsolation,
            v = e.inert,
            y = e.allowPinchZoom,
            b = e.as,
            x = b === void 0 ? `div` : b,
            S = e.gapMode,
            C = a(e, [`forwardProps`, `children`, `className`, `removeScrollBar`, `enabled`, `shards`, `sideCar`, `noRelative`, `noIsolation`, `inert`, `allowPinchZoom`, `as`, `gapMode`]),
            w = h,
            T = le([n, t]),
            E = i(i({}, C), o);
        return u.createElement(u.Fragment, null, p && u.createElement(w, {
            sideCar: me,
            removeScrollBar: f,
            shards: m,
            noRelative: g,
            noIsolation: _,
            inert: v,
            setCallbacks: s,
            allowPinchZoom: !!y,
            lockRef: n,
            gapMode: S
        }), c ? u.cloneElement(u.Children.only(l), i(i({}, E), {
            ref: T
        })) : u.createElement(x, i({}, E, {
            className: d,
            ref: T
        }), l))
    });
H.defaultProps = {
    enabled: !0,
    removeScrollBar: !0,
    inert: !1
}, H.classNames = {
    fullWidth: L,
    zeroRight: I
};
var he, ge = function() {
    if (he) return he;
    if (typeof __webpack_nonce__ < `u`) return __webpack_nonce__
};

function _e() {
    if (!document) return null;
    var e = document.createElement(`style`);
    e.type = `text/css`;
    var t = ge();
    return t && e.setAttribute(`nonce`, t), e
}

function ve(e, t) {
    e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t))
}

function ye(e) {
    (document.head || document.getElementsByTagName(`head`)[0]).appendChild(e)
}
var be = function() {
        var e = 0,
            t = null;
        return {
            add: function(n) {
                e == 0 && (t = _e()) && (ve(t, n), ye(t)), e++
            },
            remove: function() {
                e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null)
            }
        }
    },
    xe = function() {
        var e = be();
        return function(t, n) {
            u.useEffect(function() {
                return e.add(t),
                    function() {
                        e.remove()
                    }
            }, [t && n])
        }
    },
    Se = function() {
        var e = xe();
        return function(t) {
            var n = t.styles,
                r = t.dynamic;
            return e(n, r), null
        }
    },
    Ce = {
        left: 0,
        top: 0,
        right: 0,
        gap: 0
    },
    U = function(e) {
        return parseInt(e || ``, 10) || 0
    },
    we = function(e) {
        var t = window.getComputedStyle(document.body),
            n = t[e === `padding` ? `paddingLeft` : `marginLeft`],
            r = t[e === `padding` ? `paddingTop` : `marginTop`],
            i = t[e === `padding` ? `paddingRight` : `marginRight`];
        return [U(n), U(r), U(i)]
    },
    Te = function(e) {
        if (e === void 0 && (e = `margin`), typeof window > `u`) return Ce;
        var t = we(e),
            n = document.documentElement.clientWidth,
            r = window.innerWidth;
        return {
            left: t[0],
            top: t[1],
            right: t[2],
            gap: Math.max(0, r - n + t[2] - t[0])
        }
    },
    Ee = Se(),
    W = `data-scroll-locked`,
    De = function(e, t, n, r) {
        var i = e.left,
            a = e.top,
            o = e.right,
            s = e.gap;
        return n === void 0 && (n = `margin`), `
  .${ae} {
   overflow: hidden ${r};
   padding-right: ${s}px ${r};
  }
  body[${W}] {
    overflow: hidden ${r};
    overscroll-behavior: contain;
    ${[t&&`position: relative ${r};`,n===`margin`&&`
    padding-left: ${i}px;
    padding-top: ${a}px;
    padding-right: ${o}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${s}px ${r};
    `,n===`padding`&&`padding-right: ${s}px ${r};`].filter(Boolean).join(``)}
  }
  
  .${I} {
    right: ${s}px ${r};
  }
  
  .${L} {
    margin-right: ${s}px ${r};
  }
  
  .${I} .${I} {
    right: 0 ${r};
  }
  
  .${L} .${L} {
    margin-right: 0 ${r};
  }
  
  body[${W}] {
    ${oe}: ${s}px;
  }
`
    },
    Oe = function() {
        var e = parseInt(document.body.getAttribute(`data-scroll-locked`) || `0`, 10);
        return isFinite(e) ? e : 0
    },
    ke = function() {
        u.useEffect(function() {
            return document.body.setAttribute(W, (Oe() + 1).toString()),
                function() {
                    var e = Oe() - 1;
                    e <= 0 ? document.body.removeAttribute(W) : document.body.setAttribute(W, e.toString())
                }
        }, [])
    },
    Ae = function(e) {
        var t = e.noRelative,
            n = e.noImportant,
            r = e.gapMode,
            i = r === void 0 ? `margin` : r;
        ke();
        var a = u.useMemo(function() {
            return Te(i)
        }, [i]);
        return u.createElement(Ee, {
            styles: De(a, !t, i, n ? `` : `!important`)
        })
    },
    G = !1;
if (typeof window < `u`) try {
    var K = Object.defineProperty({}, "passive", {
        get: function() {
            return G = !0, !0
        }
    });
    window.addEventListener(`test`, K, K), window.removeEventListener(`test`, K, K)
} catch {
    G = !1
}
var q = G ? {
        passive: !1
    } : !1,
    je = function(e) {
        return e.tagName === `TEXTAREA`
    },
    Me = function(e, t) {
        if (!(e instanceof Element)) return !1;
        var n = window.getComputedStyle(e);
        return n[t] !== `hidden` && !(n.overflowY === n.overflowX && !je(e) && n[t] === `visible`)
    },
    Ne = function(e) {
        return Me(e, `overflowY`)
    },
    Pe = function(e) {
        return Me(e, `overflowX`)
    },
    Fe = function(e, t) {
        var n = t.ownerDocument,
            r = t;
        do {
            if (typeof ShadowRoot < `u` && r instanceof ShadowRoot && (r = r.host), Re(e, r)) {
                var i = ze(e, r);
                if (i[1] > i[2]) return !0
            }
            r = r.parentNode
        } while (r && r !== n.body);
        return !1
    },
    Ie = function(e) {
        return [e.scrollTop, e.scrollHeight, e.clientHeight]
    },
    Le = function(e) {
        return [e.scrollLeft, e.scrollWidth, e.clientWidth]
    },
    Re = function(e, t) {
        return e === `v` ? Ne(t) : Pe(t)
    },
    ze = function(e, t) {
        return e === `v` ? Ie(t) : Le(t)
    },
    Be = function(e, t) {
        return e === `h` && t === `rtl` ? -1 : 1
    },
    Ve = function(e, t, n, r, i) {
        var a = Be(e, window.getComputedStyle(t).direction),
            o = a * r,
            s = n.target,
            c = t.contains(s),
            l = !1,
            u = o > 0,
            d = 0,
            f = 0;
        do {
            if (!s) break;
            var p = ze(e, s),
                m = p[0],
                h = p[1] - p[2] - a * m;
            (m || h) && Re(e, s) && (d += h, f += m);
            var g = s.parentNode;
            s = g && g.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? g.host : g
        } while (!c && s !== document.body || c && (t.contains(s) || t === s));
        return (u && (i && Math.abs(d) < 1 || !i && o > d) || !u && (i && Math.abs(f) < 1 || !i && -o > f)) && (l = !0), l
    },
    J = function(e) {
        return `changedTouches` in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0]
    },
    He = function(e) {
        return [e.deltaX, e.deltaY]
    },
    Ue = function(e) {
        return e && `current` in e ? e.current : e
    },
    We = function(e, t) {
        return e[0] === t[0] && e[1] === t[1]
    },
    Ge = function(e) {
        return `
  .block-interactivity-${e} {pointer-events: none;}
  .allow-interactivity-${e} {pointer-events: all;}
`
    },
    Ke = 0,
    Y = [];

function qe(e) {
    var t = u.useRef([]),
        n = u.useRef([0, 0]),
        i = u.useRef(),
        a = u.useState(Ke++)[0],
        o = u.useState(Se)[0],
        s = u.useRef(e);
    u.useEffect(function() {
        s.current = e
    }, [e]), u.useEffect(function() {
        if (e.inert) {
            document.body.classList.add(`block-interactivity-${a}`);
            var t = r([e.lockRef.current], (e.shards || []).map(Ue), !0).filter(Boolean);
            return t.forEach(function(e) {
                    return e.classList.add(`allow-interactivity-${a}`)
                }),
                function() {
                    document.body.classList.remove(`block-interactivity-${a}`), t.forEach(function(e) {
                        return e.classList.remove(`allow-interactivity-${a}`)
                    })
                }
        }
    }, [e.inert, e.lockRef.current, e.shards]);
    var c = u.useCallback(function(e, t) {
            if (`touches` in e && e.touches.length === 2 || e.type === `wheel` && e.ctrlKey) return !s.current.allowPinchZoom;
            var r = J(e),
                a = n.current,
                o = `deltaX` in e ? e.deltaX : a[0] - r[0],
                c = `deltaY` in e ? e.deltaY : a[1] - r[1],
                l, u = e.target,
                d = Math.abs(o) > Math.abs(c) ? `h` : `v`;
            if (`touches` in e && d === `h` && u.type === `range`) return !1;
            var f = window.getSelection(),
                p = f && f.anchorNode;
            if (p && (p === u || p.contains(u))) return !1;
            var m = Fe(d, u);
            if (!m) return !0;
            if (m ? l = d : (l = d === `v` ? `h` : `v`, m = Fe(d, u)), !m) return !1;
            if (!i.current && `changedTouches` in e && (o || c) && (i.current = l), !l) return !0;
            var h = i.current || l;
            return Ve(h, t, e, h === `h` ? o : c, !0)
        }, []),
        l = u.useCallback(function(e) {
            var n = e;
            if (!(!Y.length || Y[Y.length - 1] !== o)) {
                var r = `deltaY` in n ? He(n) : J(n),
                    i = t.current.filter(function(e) {
                        return e.name === n.type && (e.target === n.target || n.target === e.shadowParent) && We(e.delta, r)
                    })[0];
                if (i && i.should) {
                    n.cancelable && n.preventDefault();
                    return
                }
                if (!i) {
                    var a = (s.current.shards || []).map(Ue).filter(Boolean).filter(function(e) {
                        return e.contains(n.target)
                    });
                    (a.length > 0 ? c(n, a[0]) : !s.current.noIsolation) && n.cancelable && n.preventDefault()
                }
            }
        }, []),
        d = u.useCallback(function(e, n, r, i) {
            var a = {
                name: e,
                delta: n,
                target: r,
                should: i,
                shadowParent: Je(r)
            };
            t.current.push(a), setTimeout(function() {
                t.current = t.current.filter(function(e) {
                    return e !== a
                })
            }, 1)
        }, []),
        f = u.useCallback(function(e) {
            n.current = J(e), i.current = void 0
        }, []),
        p = u.useCallback(function(t) {
            d(t.type, He(t), t.target, c(t, e.lockRef.current))
        }, []),
        m = u.useCallback(function(t) {
            d(t.type, J(t), t.target, c(t, e.lockRef.current))
        }, []);
    u.useEffect(function() {
        return Y.push(o), e.setCallbacks({
                onScrollCapture: p,
                onWheelCapture: p,
                onTouchMoveCapture: m
            }), document.addEventListener(`wheel`, l, q), document.addEventListener(`touchmove`, l, q), document.addEventListener(`touchstart`, f, q),
            function() {
                Y = Y.filter(function(e) {
                    return e !== o
                }), document.removeEventListener(`wheel`, l, q), document.removeEventListener(`touchmove`, l, q), document.removeEventListener(`touchstart`, f, q)
            }
    }, []);
    var h = e.removeScrollBar,
        g = e.inert;
    return u.createElement(u.Fragment, null, g ? u.createElement(o, {
        styles: Ge(a)
    }) : null, h ? u.createElement(Ae, {
        noRelative: e.noRelative,
        gapMode: e.gapMode
    }) : null)
}

function Je(e) {
    for (var t = null; e !== null;) e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
    return t
}
var Ye = pe(me, qe),
    Xe = u.forwardRef(function(e, t) {
        return u.createElement(H, i({}, e, {
            ref: t,
            sideCar: Ye
        }))
    });
Xe.classNames = H.classNames;
var Ze = function(e) {
        return typeof document > `u` ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body
    },
    X = new WeakMap,
    Z = new WeakMap,
    Q = {},
    $ = 0,
    Qe = function(e) {
        return e && (e.host || Qe(e.parentNode))
    },
    $e = function(e, t) {
        return t.map(function(t) {
            if (e.contains(t)) return t;
            var n = Qe(t);
            return n && e.contains(n) ? n : (console.error(`aria-hidden`, t, `in not contained inside`, e, `. Doing nothing`), null)
        }).filter(function(e) {
            return !!e
        })
    },
    et = function(e, t, n, r) {
        var i = $e(t, Array.isArray(e) ? e : [e]);
        Q[n] || (Q[n] = new WeakMap);
        var a = Q[n],
            o = [],
            s = new Set,
            c = new Set(i),
            l = function(e) {
                !e || s.has(e) || (s.add(e), l(e.parentNode))
            };
        i.forEach(l);
        var u = function(e) {
            !e || c.has(e) || Array.prototype.forEach.call(e.children, function(e) {
                if (s.has(e)) u(e);
                else try {
                    var t = e.getAttribute(r),
                        i = t !== null && t !== `false`,
                        c = (X.get(e) || 0) + 1,
                        l = (a.get(e) || 0) + 1;
                    X.set(e, c), a.set(e, l), o.push(e), c === 1 && i && Z.set(e, !0), l === 1 && e.setAttribute(n, `true`), i || e.setAttribute(r, `true`)
                } catch (t) {
                    console.error(`aria-hidden: cannot operate on `, e, t)
                }
            })
        };
        return u(t), s.clear(), $++,
            function() {
                o.forEach(function(e) {
                    var t = X.get(e) - 1,
                        i = a.get(e) - 1;
                    X.set(e, t), a.set(e, i), t || (Z.has(e) || e.removeAttribute(r), Z.delete(e)), i || e.removeAttribute(n)
                }), $--, $ || (X = new WeakMap, X = new WeakMap, Z = new WeakMap, Q = {})
            }
    },
    tt = function(e, t, n) {
        n === void 0 && (n = `data-aria-hidden`);
        var r = Array.from(Array.isArray(e) ? e : [e]),
            i = t || Ze(e);
        return i ? (r.push.apply(r, Array.from(i.querySelectorAll(`[aria-live], script`))), et(r, i, n, `aria-hidden`)) : function() {
            return null
        }
    };
export {
    h as a, S as i, Xe as n, P as r, tt as t
};