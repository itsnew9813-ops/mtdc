import {
    t as e
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t
} from "./router-compat-DVALc1LS.js";
import {
    t as n
} from "./arrow-right-BAISyOlv.js";
import {
    t as r
} from "./calendar-check-9weHorr-.js";
import {
    t as i
} from "./map-pin-BrptJX3m.js";
import {
    t as a
} from "./star-eZN0kLzH.js";
import {
    i as o
} from "./bookingDialog-n1isumFq.js";
import {
    t as s
} from "./useScrollAnimation-CxH8JxXs.js";
import {
    n as c
} from "./useLiveHotels-BO9mdoya.js";
var l = e(),
    u = () => {
        let {
            ref: e,
            isVisible: u
        } = s(), d = c().slice(0, 5);
        return (0, l.jsxs)(`section`, {
            id: `hotels`,
            ref: e,
            className: `py-20 md:py-28 bg-background overflow-hidden transition-all duration-700 ${u?`opacity-100 translate-y-0`:`opacity-0 translate-y-6`}`,
            children: [(0, l.jsx)(`div`, {
                className: `section-padding`,
                children: (0, l.jsxs)(`div`, {
                    className: `max-w-7xl mx-auto`,
                    children: [(0, l.jsxs)(`div`, {
                        className: `section-masthead`,
                        children: [(0, l.jsx)(`span`, {
                            className: `folio`,
                            children: `02 — Stay with us`
                        }), (0, l.jsx)(`span`, {
                            className: `rule`
                        }), (0, l.jsx)(`span`, {
                            className: `kicker`,
                            children: `Beaches · Hills · Caves · Jungles`
                        })]
                    }), (0, l.jsxs)(`div`, {
                        className: `mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between`,
                        children: [(0, l.jsx)(`h3`, {
                            className: `display-serif text-3xl text-primary md:text-4xl`,
                            children: `A few resorts guests are booking now`
                        }), (0, l.jsx)(`p`, {
                            className: `text-sm text-muted-foreground`,
                            children: `Swipe through, then browse the full network.`
                        })]
                    })]
                })
            }), (0, l.jsxs)(`div`, {
                className: `mb-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-80rem)/2))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
                children: [d.map(e => (0, l.jsxs)(`article`, {
                    className: `group w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl sm:w-[340px]`,
                    children: [(0, l.jsx)(t, {
                        to: `/resorts/${e.slug}`,
                        className: `block aspect-[4/3] overflow-hidden bg-stone-100`,
                        children: (0, l.jsx)(`img`, {
                            src: e.image,
                            alt: e.name,
                            className: `h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105`,
                            loading: `lazy`,
                            decoding: `async`,
                            onError: e => {
                                e.currentTarget.src = `/images/hotel-1.jpg`
                            }
                        })
                    }), (0, l.jsxs)(`div`, {
                        className: `p-5`,
                        children: [(0, l.jsxs)(`div`, {
                            className: `flex items-center justify-between gap-2`,
                            children: [(0, l.jsx)(`span`, {
                                className: `text-[10px] font-display italic uppercase tracking-widest text-accent`,
                                children: e.category
                            }), (0, l.jsxs)(`span`, {
                                className: `inline-flex items-center gap-1 text-[11px] font-semibold text-primary`,
                                children: [(0, l.jsx)(a, {
                                    className: `h-3 w-3 fill-accent text-accent`
                                }), ` `, e.rating]
                            })]
                        }), (0, l.jsx)(t, {
                            to: `/resorts/${e.slug}`,
                            className: `block`,
                            children: (0, l.jsx)(`h4`, {
                                className: `display-serif mt-1.5 text-xl leading-tight text-primary group-hover:underline underline-offset-4 decoration-accent/60`,
                                children: e.displayName
                            })
                        }), (0, l.jsxs)(`p`, {
                            className: `mt-1.5 flex items-center gap-1 text-xs text-muted-foreground`,
                            children: [(0, l.jsx)(i, {
                                className: `h-3 w-3`
                            }), ` `, e.location, ` · `, e.state]
                        }), (0, l.jsxs)(`div`, {
                            className: `mt-4 flex flex-wrap items-center gap-2`,
                            children: [(0, l.jsxs)(`button`, {
                                type: `button`,
                                onClick: () => o({
                                    initialHotelName: e.name,
                                    allowHotelSelection: !0
                                }),
                                className: `btn-book-now btn-shimmer inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[10px]`,
                                children: [(0, l.jsx)(r, {
                                    className: `h-3 w-3`
                                }), ` Book Now`]
                            }), (0, l.jsxs)(t, {
                                to: `/resorts/${e.slug}`,
                                className: `inline-flex items-center gap-1 rounded-full border border-primary/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground`,
                                children: [`View property `, (0, l.jsx)(n, {
                                    className: `h-3 w-3`
                                })]
                            })]
                        })]
                    })]
                }, e.name)), (0, l.jsxs)(t, {
                    to: `/resorts`,
                    className: `flex w-[60vw] max-w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-secondary/40 p-6 text-center transition-colors hover:bg-secondary sm:w-[240px]`,
                    children: [(0, l.jsx)(`span`, {
                        className: `flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground`,
                        children: (0, l.jsx)(n, {
                            className: `h-5 w-5`
                        })
                    }), (0, l.jsx)(`span`, {
                        className: `display-serif text-xl text-primary`,
                        children: `View all resorts`
                    }), (0, l.jsx)(`span`, {
                        className: `text-[11px] uppercase tracking-widest text-muted-foreground`,
                        children: `38 properties across Maharashtra`
                    })]
                })]
            }), (0, l.jsx)(`div`, {
                className: `section-padding`,
                children: (0, l.jsxs)(`div`, {
                    className: `max-w-4xl mx-auto border-t-2 border-primary pt-10`,
                    children: [(0, l.jsx)(`p`, {
                        className: `editorial-eyebrow mb-6`,
                        children: `Selected stays`
                    }), (0, l.jsx)(`ul`, {
                        className: `divide-y divide-border/70`,
                        children: d.map(e => (0, l.jsxs)(`li`, {
                            className: `group flex items-start gap-4 py-4`,
                            children: [(0, l.jsx)(t, {
                                to: `/resorts/${e.slug}`,
                                className: `h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-100`,
                                children: (0, l.jsx)(`img`, {
                                    src: e.image,
                                    alt: e.name,
                                    className: `h-full w-full object-cover transition-transform duration-500 group-hover:scale-110`,
                                    loading: `lazy`,
                                    decoding: `async`,
                                    onError: e => {
                                        e.currentTarget.src = `/images/hotel-1.jpg`
                                    }
                                })
                            }), (0, l.jsxs)(`div`, {
                                className: `min-w-0 flex-1`,
                                children: [(0, l.jsx)(`span`, {
                                    className: `text-[10px] font-display italic uppercase tracking-widest text-accent`,
                                    children: e.category
                                }), (0, l.jsx)(t, {
                                    to: `/resorts/${e.slug}`,
                                    className: `block`,
                                    children: (0, l.jsx)(`h4`, {
                                        className: `mt-0.5 font-display text-base font-bold leading-tight text-primary group-hover:underline`,
                                        children: e.displayName
                                    })
                                }), (0, l.jsxs)(`p`, {
                                    className: `mt-1 flex items-center gap-1 text-xs text-muted-foreground`,
                                    children: [(0, l.jsx)(i, {
                                        className: `h-3 w-3`
                                    }), ` `, e.location]
                                }), (0, l.jsxs)(`div`, {
                                    className: `mt-2.5 flex flex-wrap items-center gap-2`,
                                    children: [(0, l.jsxs)(`button`, {
                                        type: `button`,
                                        onClick: () => o({
                                            initialHotelName: e.name,
                                            allowHotelSelection: !0
                                        }),
                                        className: `btn-book-now btn-shimmer inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px]`,
                                        children: [(0, l.jsx)(r, {
                                            className: `h-3 w-3`
                                        }), ` Book Now`]
                                    }), (0, l.jsxs)(t, {
                                        to: `/resorts/${e.slug}`,
                                        className: `inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-accent`,
                                        children: [`View property `, (0, l.jsx)(n, {
                                            className: `h-3 w-3`
                                        })]
                                    })]
                                })]
                            })]
                        }, e.name))
                    }), (0, l.jsx)(`div`, {
                        className: `mt-8 text-center`,
                        children: (0, l.jsxs)(t, {
                            to: `/resorts`,
                            className: `btn-book-now inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs`,
                            children: [`View all resorts `, (0, l.jsx)(n, {
                                className: `h-3.5 w-3.5`
                            })]
                        })
                    })]
                })
            })]
        })
    };
export {
    u as
    default
};