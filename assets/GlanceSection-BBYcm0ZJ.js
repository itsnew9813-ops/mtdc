import {
    t as e
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t
} from "./createLucideIcon-BZ5eRbaK.js";
import {
    t as n
} from "./building-2-BdRnaXvW.js";
import {
    t as r
} from "./landmark-DhYuvtjx.js";
import {
    t as i
} from "./sparkles-C0UsdKnn.js";
import {
    t as a
} from "./tree-pine-BhBIvw-Y.js";
import {
    t as o
} from "./waves-Dxc42WgO.js";
import {
    i as s
} from "./bookingDialog-n1isumFq.js";
import {
    t as c
} from "./useScrollAnimation-CxH8JxXs.js";
var l = t(`map-pinned`, [
        [`path`, {
            d: `M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0`,
            key: `11u0oz`
        }],
        [`circle`, {
            cx: `12`,
            cy: `8`,
            r: `2`,
            key: `1822b1`
        }],
        [`path`, {
            d: `M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712`,
            key: `q8zwxj`
        }]
    ]),
    u = e(),
    d = [{
        value: `38`,
        label: `MTDC resorts`
    }, {
        value: `720+`,
        label: `Km of coastline`
    }, {
        value: `5`,
        label: `UNESCO sites`
    }, {
        value: `6`,
        label: `Tiger reserves`
    }],
    f = [{
        icon: o,
        title: `Konkan & the Coast`,
        body: `Tarkarli, Ganpatipule, Harihareshwar and Velneshwar — white sand, scuba reefs and Malvani kitchens.`
    }, {
        icon: a,
        title: `Sahyadri Hills & Lakes`,
        body: `Matheran, Malshej Ghat, Bhandardara and Chikhaldara — monsoon waterfalls and ridge-top mornings.`
    }, {
        icon: r,
        title: `Heritage & Caves`,
        body: `Ajanta, Ellora, Lonar crater and Deccan forts — two thousand years of rock-cut Maharashtra.`
    }, {
        icon: l,
        title: `Wildlife & Pilgrimage`,
        body: `Tadoba, Pench and Navegaon jungle lodges, plus pilgrim stays at Shirdi and Nashik.`
    }],
    p = () => {
        let {
            ref: e,
            isVisible: t
        } = c();
        return (0, u.jsx)(`section`, {
            ref: e,
            className: `section-padding overflow-hidden bg-secondary/40 py-16 transition-all duration-700 md:py-24 ${t?`translate-y-0 opacity-100`:`translate-y-6 opacity-0`}`,
            children: (0, u.jsxs)(`div`, {
                className: `mx-auto max-w-7xl`,
                children: [(0, u.jsx)(`div`, {
                    className: `grid grid-cols-2 gap-4 sm:grid-cols-4`,
                    children: d.map(e => (0, u.jsxs)(`div`, {
                        className: `rounded-2xl border border-border bg-background px-4 py-6 text-center`,
                        children: [(0, u.jsx)(`p`, {
                            className: `display-serif text-3xl text-primary sm:text-4xl`,
                            children: e.value
                        }), (0, u.jsx)(`p`, {
                            className: `mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground`,
                            children: e.label
                        })]
                    }, e.label))
                }), (0, u.jsxs)(`div`, {
                    className: `mt-14 text-center`,
                    children: [(0, u.jsx)(`p`, {
                        className: `editorial-eyebrow`,
                        children: `Plan your Maharashtra`
                    }), (0, u.jsx)(`h2`, {
                        className: `display-serif mt-2 text-3xl text-primary md:text-4xl`,
                        children: `One state, four very different holidays`
                    })]
                }), (0, u.jsx)(`div`, {
                    className: `mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4`,
                    children: f.map(e => (0, u.jsxs)(`article`, {
                        className: `group rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.4)]`,
                        children: [(0, u.jsx)(`span`, {
                            className: `inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground`,
                            children: (0, u.jsx)(e.icon, {
                                className: `h-5 w-5`
                            })
                        }), (0, u.jsx)(`h3`, {
                            className: `mt-4 font-display text-lg font-bold text-primary`,
                            children: e.title
                        }), (0, u.jsx)(`p`, {
                            className: `mt-2 text-sm leading-relaxed text-muted-foreground`,
                            children: e.body
                        })]
                    }, e.title))
                }), (0, u.jsxs)(`div`, {
                    className: `mt-12 flex flex-col items-center gap-4 rounded-2xl border border-accent/40 bg-background px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left`,
                    children: [(0, u.jsxs)(`div`, {
                        className: `flex items-start gap-3`,
                        children: [(0, u.jsx)(n, {
                            className: `mt-0.5 h-5 w-5 shrink-0 text-accent`
                        }), (0, u.jsx)(`p`, {
                            className: `max-w-xl text-sm text-muted-foreground`,
                            children: `Every stay is operated by the Maharashtra Tourism Development Corporation — government tariff, no agent mark-up and complimentary breakfast on every room.`
                        })]
                    }), (0, u.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => s({
                            allowHotelSelection: !0
                        }),
                        className: `btn-book-now btn-shimmer btn-glow inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3 text-xs`,
                        children: [(0, u.jsx)(i, {
                            className: `h-3.5 w-3.5`
                        }), ` Reserve Now`]
                    })]
                })]
            })
        })
    };
export {
    p as
    default
};