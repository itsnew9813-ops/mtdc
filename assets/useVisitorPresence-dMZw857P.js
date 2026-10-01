import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t
} from "./jsx-runtime-DE3RlOCf.js";
import {
    r as n
} from "./router-compat-DVALc1LS.js";
import {
    t as r
} from "./client-B0gse2_o.js";
var i = e(t(), 1),
    a = {
        "/": `Home`,
        "/resorts": `Our Resorts`,
        "/destinations": `Destinations`,
        "/track-booking": `Track My Booking`,
        "/booking-confirmed": `Booking Confirmation`,
        "/secure-payment": `Secure Payment`,
        "/payment-status-check": `Payment Status`,
        "/request-refund": `Refund Request`,
        "/refund-receipt": `Refund Voucher`,
        "/sustainability": `Sustainability`,
        "/about": `About MTDC`,
        "/about-us": `About MTDC`,
        "/find-hotels": `Our Resorts`,
        "/booking-search": `Track My Booking`,
        "/terms": `Terms & Conditions`,
        "/legal": `Legal & Ownership`,
        "/payment": `Secure Payment`,
        "/payment-status": `Payment Status`,
        "/booking-confirmation": `Booking Confirmation`,
        "/refund-request": `Refund Request`,
        "/refund-voucher": `Refund Voucher`,
        "/legal-and-ownership": `Legal & Ownership`,
        "/privacy-policy": `Privacy Policy`,
        "/terms-and-conditions": `Terms & Conditions`,
        "/refund-policy": `Refund Policy`,
        "/cancellation-policy": `Cancellation Policy`,
        "/unsubscribe": `Email Unsubscribe`
    },
    o = {
        "": `Admin Dashboard`,
        login: `Admin Login`,
        properties: `Admin Properties`,
        rooms: `Admin Rooms`,
        bookings: `Admin Bookings`,
        payments: `Admin Payments`,
        "refund-requests": `Admin Refund Requests`,
        "status-checks": `Admin Status Checks`,
        settings: `Admin Settings`
    },
    s = [`resorts`, `hotel`, `offers`, `offer`, `booking-voucher`, `voucher`],
    c = e => e.replace(/[-_]+/g, ` `).trim().replace(/\b\w/g, e => e.toUpperCase());

function l(e) {
    if (!e) return `Unknown`;
    let [t] = e.split(`?`), n = t.replace(/\/+$/, ``) || `/`;
    if (a[n]) return a[n];
    let r = n.split(`/`).filter(Boolean);
    return r[0] === `console` || r[0] === `admin` ? o[r[1] || ``] || `Admin` : (r[0] === `resorts` || r[0] === `hotel`) && r[1] ? r[2] === `rooms` ? `${c(r[1])} — Rooms` : `${c(r[1])} — Resort` : (r[0] === `offers` || r[0] === `offer`) && r[1] ? `Offer — ${c(r[1])}` : (r[0] === `booking-voucher` || r[0] === `voucher`) && r[1] ? `Booking Voucher ${r[1].toUpperCase()}` : r.length ? s.includes(r[0]) ? c(r.join(` / `)) : `Not Found (${n})` : `Home`
}
var u = `site-visitors`,
    d = `mtdc_live_booking_journey`;

function f() {
    try {
        let e = `mtdc_visitor_id`,
            t = localStorage.getItem(e);
        return t || (t = Math.random().toString(36).slice(2) + Date.now().toString(36), localStorage.setItem(e, t)), t
    } catch {
        return Math.random().toString(36).slice(2)
    }
}

function p() {
    let e = navigator.userAgent || ``;
    return /iPad|Tablet|PlayBook|Silk/i.test(e) || /Android/i.test(e) && !/Mobile/i.test(e) ? `tablet` : /Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(e) || window.innerWidth < 768 ? `mobile` : `desktop`
}

function m() {
    let e = navigator.userAgent;
    return /Edg\//.test(e) ? `Edge` : /OPR\//.test(e) ? `Opera` : /Chrome\//.test(e) && !/Chromium/.test(e) ? `Chrome` : /Safari\//.test(e) && /Version\//.test(e) ? `Safari` : /Firefox\//.test(e) ? `Firefox` : `Other`
}

function h() {
    let e = navigator.userAgent;
    return /iPhone|iPad|iPod/.test(e) ? `iOS` : /Android/.test(e) ? `Android` : /Mac OS X/.test(e) ? `macOS` : /Windows/.test(e) ? `Windows` : /Linux/.test(e) ? `Linux` : `Other`
}

function g(e) {
    try {
        let t = `mtdc_session_id`,
            n = sessionStorage.getItem(t);
        return n || (n = `${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`, sessionStorage.setItem(t, n)), n
    } catch {
        return `${e}-${Date.now().toString(36)}`
    }
}

function _() {
    return `en`
}
var v = {},
    y = `mtdc_geo`;
try {
    let e = sessionStorage.getItem(y);
    e && (v = JSON.parse(e))
} catch {}
async function b() {
    if (v.city || v.country) return v;
    try {
        let e = await fetch(`https://ipapi.co/json/`);
        if (!e.ok) return v;
        let t = await e.json();
        v = {
            city: t.city || void 0,
            region: t.region || void 0,
            country: t.country_name || t.country || void 0
        };
        try {
            sessionStorage.setItem(y, JSON.stringify(v))
        } catch {}
    } catch {}
    return v
}

function x(e) {
    let [t, n] = e.split(`?`);
    if (!n) return t;
    let r = new URLSearchParams(n);
    [...r.keys()].forEach(e => {
        e.startsWith(`__lovable`) && r.delete(e)
    });
    let i = r.toString();
    return i ? `${t}?${i}` : t
}

function S(e) {
    return e === `/admin` || e.startsWith(`/admin/`) || e === `/console` || e.startsWith(`/console/`)
}
var C = globalThis.__mtdcLiveStore ??= {
        map: new Map,
        seq: 0,
        listeners: new Set
    },
    w = C.map,
    T, E = C.listeners;

function D() {
    let e = null;
    for (let t of w.values())(!e || t.seq > e.seq) && (e = t);
    if (e) return e.progress;
    if (typeof window > `u`) return null;
    try {
        let e = sessionStorage.getItem(d);
        return e ? JSON.parse(e) : null
    } catch {
        return null
    }
}

function O(e, t = `booking`) {
    if (e === null) {
        if (!w.delete(t)) return;
        w.size === 0 && (clearTimeout(T), T = setTimeout(() => {
            if (!(w.size > 0)) {
                try {
                    sessionStorage.removeItem(d)
                } catch {}
                E.forEach(e => e())
            }
        }, 5e3))
    } else {
        clearTimeout(T), w.set(t, {
            progress: e,
            seq: ++C.seq
        });
        try {
            sessionStorage.setItem(d, JSON.stringify(e))
        } catch {}
    }
    E.forEach(e => e())
}
var k = null;

function A() {
    return k
}

function j(e, t) {
    let n = e.replace(/\s+/g, ` `).trim().slice(0, 80);
    n && (k = {
        label: n,
        at: new Date().toISOString(),
        path: t ?? (typeof window < `u` ? window.location.pathname : ``)
    }, E.forEach(e => e()))
}

function M(e) {
    return {
        flow: `Browsing`,
        step: 1,
        totalSteps: 1,
        stepLabel: `Viewing ${l(e)}`
    }
}

function N(e = !0) {
    let t = n(),
        a = (0, i.useRef)(null),
        o = (0, i.useRef)(new Date().toISOString()),
        s = (0, i.useRef)(x(t.pathname + t.search)),
        c = (0, i.useRef)(0),
        l = (0, i.useRef)(null),
        d = (0, i.useRef)(null);
    (0, i.useEffect)(() => {
        if (!e) return;
        let t = f(),
            n = () => ({
                visitor_id: t,
                device: p(),
                browser: m(),
                os: h(),
                path: s.current,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                referrer: document.referrer || ``,
                lang: _(),
                city: v.city || null,
                region: v.region || null,
                country: v.country || null,
                joined_at: o.current,
                last_active: new Date().toISOString(),
                booking: D() ?? M(s.current),
                action: A()
            }),
            i = r.channel(u, {
                config: {
                    presence: {
                        key: t
                    }
                }
            });
        a.current = i;
        let l = !1,
            y = 0,
            x, C = 0,
            w = null,
            T = () => {
                if (x = void 0, !l) return;
                let e = Date.now(),
                    t = Math.max(y + 700, C) - e;
                if (t > 0) {
                    x = window.setTimeout(T, t);
                    return
                }
                y = e, i.send({
                    type: `broadcast`,
                    event: `visitor`,
                    payload: n()
                }).catch(() => {})
            },
            O = (e = !1) => {
                x === void 0 && (x = window.setTimeout(T, e ? 0 : 150))
            };
        d.current = O, i.on(`system`, {}, e => {
            e ?.status === `error` && /rate limit/i.test(e.message || ``) && (C = Date.now() + 1e4, window.clearTimeout(x), x = window.setTimeout(() => {
                w ?.(), T()
            }, 1e4))
        }), i.subscribe(async e => {
            e === `SUBSCRIBED` ? (l = !0, i.track(n()).catch(() => {}), await b(), O()) : l = !1
        });
        let k, N = () => O();
        E.add(N);
        let P = e => {
                if (!e) return ``;
                let t = e.closest(`button,a,[role=button],[role=tab],[role=option],[role=menuitem],[role=radio],[role=checkbox],[role=switch],[data-radix-collection-item],input,select,textarea,summary,label,[data-track],[data-slot=day],[tabindex]`),
                    n = t ?? e,
                    r = n.tagName.toLowerCase(),
                    i = n.dataset ?.track || n.getAttribute(`aria-label`) || n.getAttribute(`title`) || n.placeholder || n.name || (n.innerText || n.textContent || ``).trim();
                if (!t && !i) return ``;
                let a = n.getAttribute(`role`) || ``;
                return `${r===`a`?`Opened`:r===`button`||a===`button`?`Clicked`:r===`input`||r===`textarea`||r===`select`?`Typed in`:`Tapped`}: ${(i||a||r).replace(/\s+/g,` `).slice(0,60)}`
            },
            F = e => {
                window.requestAnimationFrame(() => window.setTimeout(e, 0))
            },
            I = 0,
            L = e => {
                if (S(s.current)) return;
                let t = Date.now();
                if (t - I < 250) return;
                I = t;
                let n = e.target;
                F(() => {
                    let e = P(n);
                    e && j(e, s.current)
                })
            },
            R = new WeakMap,
            z = e => {
                if (S(s.current)) return;
                let t = e.target;
                if (!t || t.type === `password`) return;
                let n = R.get(t);
                n && clearTimeout(n), R.set(t, window.setTimeout(() => {
                    F(() => {
                        let e = P(t);
                        e && j(e, s.current)
                    })
                }, 700))
            },
            B = () => {
                S(s.current) || j(`Submitted a form`, s.current)
            },
            V = () => {
                if (document.visibilityState === `visible` && !S(s.current)) {
                    try {
                        let e = i.state;
                        if (e !== `joined` && e !== `joining`) {
                            try {
                                r.realtime.connect()
                            } catch {}
                            l = !1, i.subscribe(async e => {
                                e === `SUBSCRIBED` && (l = !0, i.track(n()).catch(() => {}), O(!0))
                            });
                            return
                        }
                    } catch {}
                    O()
                }
            };
        w = V;
        let H = V;
        document.addEventListener(`click`, L, !0), document.addEventListener(`pointerdown`, L, !0), document.addEventListener(`input`, z, !0), document.addEventListener(`change`, z, !0), document.addEventListener(`submit`, B, !0), document.addEventListener(`visibilitychange`, H), window.addEventListener(`focus`, H), window.addEventListener(`pageshow`, H), window.addEventListener(`online`, H);
        let U = window.setInterval(() => {
            S(s.current) || (V(), r.rpc(`track_visitor_session`, {
                _session_id: g(t),
                _visitor_id: t,
                _device: p(),
                _browser: m(),
                _os: h(),
                _viewport: `${window.innerWidth}x${window.innerHeight}`,
                _referrer: document.referrer || ``,
                _path: s.current,
                _page_views: c.current,
                _city: v.city ?? void 0,
                _region: v.region ?? void 0,
                _country: v.country ?? void 0
            }).then(() => {}, () => {}))
        }, 1e4);
        return () => {
            window.clearInterval(U), window.clearTimeout(k), window.clearTimeout(x), d.current = null, E.delete(N), document.removeEventListener(`click`, L, !0), document.removeEventListener(`pointerdown`, L, !0), document.removeEventListener(`input`, z, !0), document.removeEventListener(`change`, z, !0), document.removeEventListener(`submit`, B, !0), document.removeEventListener(`visibilitychange`, H), window.removeEventListener(`focus`, H), window.removeEventListener(`pageshow`, H), window.removeEventListener(`online`, H), a.current = null, r.removeChannel(i)
        }
    }, [e]), (0, i.useEffect)(() => {
        if (!e) return;
        let n = f(),
            i = g(n),
            a = x(t.pathname + t.search);
        if (S(a)) return;
        s.current = a, c.current += 1;
        let o = p(),
            u = r.rpc(`track_visitor_session`, {
                _session_id: i,
                _visitor_id: n,
                _device: o,
                _browser: m(),
                _os: h(),
                _viewport: `${window.innerWidth}x${window.innerHeight}`,
                _referrer: document.referrer || ``,
                _path: a,
                _page_views: c.current,
                _city: v.city ?? void 0,
                _region: v.region ?? void 0,
                _country: v.country ?? void 0
            });
        l.current = u.then(() => void 0, () => void 0), l.current.then(() => {
            r.from(`visitor_page_views`).insert({
                session_id: i,
                visitor_id: n,
                path: a,
                device: o,
                referrer: document.referrer || ``
            }).then(() => {}, () => {})
        })
    }, [e, t.pathname, t.search]), (0, i.useEffect)(() => {
        let e = a.current;
        if (!e) return;
        let n = x(t.pathname + t.search);
        if (s.current = n, S(n)) {
            e.untrack().catch(() => {});
            return
        }
        d.current ?.()
    }, [t.pathname, t.search])
}
export {
    l as i, O as n, N as r, u as t
};