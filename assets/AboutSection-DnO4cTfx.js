import {
    t as e
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t
} from "./award-CMO9DmIN.js";
import {
    t as n
} from "./clock-HkbhqKQQ.js";
import {
    t as r
} from "./landmark-DhYuvtjx.js";
import {
    t as i
} from "./shield-DZSm9JEi.js";
import {
    t as a
} from "./useScrollAnimation-CxH8JxXs.js";
import {
    r as o
} from "./useSiteSettings-8fHJtRuj.js";
var s = e(),
    c = () => {
        let {
            ref: e,
            isVisible: c
        } = a(), {
            brand_name: l,
            logo_url: u
        } = o();
        return (0, s.jsx)(`section`, {
            ref: e,
            className: `py-20 md:py-28 section-padding bg-background overflow-hidden transition-all duration-700 ${c?`opacity-100 translate-y-0`:`opacity-0 translate-y-10`}`,
            children: (0, s.jsxs)(`div`, {
                className: `max-w-6xl mx-auto`,
                children: [(0, s.jsxs)(`div`, {
                    className: `section-masthead`,
                    children: [(0, s.jsx)(`span`, {
                        className: `folio`,
                        children: `01 — The brand`
                    }), (0, s.jsx)(`span`, {
                        className: `rule`
                    }), (0, s.jsx)(`span`, {
                        className: `kicker`,
                        children: `A Government of Maharashtra undertaking`
                    })]
                }), (0, s.jsxs)(`div`, {
                    className: `relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/60 via-background to-accent/10 px-6 py-14 text-center sm:px-12 md:py-20`,
                    children: [(0, s.jsx)(`span`, {
                        "aria-hidden": !0,
                        className: `pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl`
                    }), (0, s.jsx)(`span`, {
                        "aria-hidden": !0,
                        className: `pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl`
                    }), (0, s.jsx)(`img`, {
                        src: u,
                        alt: l,
                        className: `mx-auto h-20 w-20 object-contain drop-shadow-sm`,
                        loading: `lazy`,
                        decoding: `async`,
                        onError: e => {
                            e.currentTarget.src = `/images/mtdc-logo.png`
                        }
                    }), (0, s.jsx)(`p`, {
                        className: `mt-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-accent`,
                        children: `Maharashtra Tourism Development Corporation`
                    }), (0, s.jsxs)(`h2`, {
                        className: `display-serif mt-4 text-4xl leading-tight text-primary md:text-6xl`,
                        children: [`Maharashtra `, (0, s.jsx)(`em`, {
                            children: `Unlimited`
                        })]
                    }), (0, s.jsx)(`p`, {
                        className: `mx-auto mt-5 max-w-xl font-display text-base italic text-muted-foreground md:text-lg`,
                        children: `The state's own hospitality network — beaches, ghats, caves, tiger reserves and pilgrim towns. Booked direct, at government tariff.`
                    }), (0, s.jsx)(`div`, {
                        className: `mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4`,
                        children: [{
                            icon: r,
                            label: `Est. 1975`
                        }, {
                            icon: i,
                            label: `Government tariff`
                        }, {
                            icon: t,
                            label: `Officially operated`
                        }, {
                            icon: n,
                            label: `Desk open 24×7`
                        }].map(({
                            icon: e,
                            label: t
                        }) => (0, s.jsxs)(`div`, {
                            className: `flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-4 backdrop-blur-sm`,
                            children: [(0, s.jsx)(e, {
                                className: `h-5 w-5 text-primary`
                            }), (0, s.jsx)(`span`, {
                                className: `text-[11px] font-semibold uppercase tracking-widest text-muted-foreground`,
                                children: t
                            })]
                        }, t))
                    }), (0, s.jsx)(`a`, {
                        href: `/resorts`,
                        className: `btn-book-now mt-10 inline-flex rounded-full px-8 py-3.5 text-xs`,
                        children: `See all 38 resorts`
                    })]
                })]
            })
        })
    };
export {
    c as
    default
};