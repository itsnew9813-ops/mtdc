import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t,
    t as n
} from "./jsx-runtime-DE3RlOCf.js";
import {
    n as r
} from "./dist-B0Orvaj5.js";
import {
    t as i
} from "./calendar-check-9weHorr-.js";
import {
    t as a
} from "./mail-DxqoHGj1.js";
import {
    t as o
} from "./map-pin-BrptJX3m.js";
import {
    t as s
} from "./menu-BYoNka0N.js";
import {
    t as c
} from "./phone-BF5r-6hK.js";
import {
    t as l
} from "./search-D1qQq2Eb.js";
import {
    t as u
} from "./x-BseqGY2W.js";
import {
    i as d
} from "./bookingDialog-n1isumFq.js";
import {
    r as f
} from "./useSiteSettings-8fHJtRuj.js";
import {
    t as p
} from "./usePhoneNumber-DuYa7FER.js";
var m = e(t(), 1),
    h = () => {
        r(`We Are Connecting You With Our Receptionist`, {
            duration: 4e3
        })
    },
    g = n(),
    _ = [{
        label: `Our Resorts`,
        href: `/resorts`
    }, {
        label: `Where to Go`,
        href: `/destinations`
    }, {
        label: `Tariff Offers`,
        href: `/#offers`
    }, {
        label: `Groups & Events`,
        href: `/#plan-an-event`
    }, {
        label: `About Us`,
        href: `/about`
    }, {
        label: `Responsible Travel`,
        href: `/sustainability`
    }],
    v = [..._, {
        label: `Talk to Us`,
        href: `/#contact-us`
    }],
    y = ({
        transparent: e = !1
    }) => {
        let [t, n] = (0, m.useState)(!1), [r, a] = (0, m.useState)(!0), [o, y] = (0, m.useState)(!1), b = p(), {
            brand_name: x,
            brand_tagline: S,
            logo_url: C
        } = f();
        (0, m.useEffect)(() => {
            let e = window.scrollY,
                t = !1,
                r = () => {
                    t = !1;
                    let r = window.scrollY;
                    n(e => e === r > 40 ? e : r > 40), r < 10 || r < e ? a(e => e || !0) : r > e + 5 && (a(e => e && !1), y(e => e && !1)), e = r
                },
                i = () => {
                    t || (t = !0, window.requestAnimationFrame(r))
                };
            return window.addEventListener(`scroll`, i, {
                passive: !0
            }), () => window.removeEventListener(`scroll`, i)
        }, []);
        let w = e && !t && !o;
        return (0, g.jsxs)(`header`, {
            className: `fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,box-shadow] duration-300 will-change-transform ${r?`translate-y-0`:`-translate-y-full`} ${w?`bg-gradient-to-b from-black/70 to-transparent border-b border-white/10`:t?`bg-white/95 backdrop-blur-md shadow-[0_1px_20px_-8px_rgba(0,0,0,0.35)] border-b border-stone-200`:`bg-white border-b border-stone-100`}`,
            children: [(0, g.jsxs)(`div`, {
                className: `section-padding flex items-center justify-between h-16 md:h-20 max-w-7xl mx-auto`,
                children: [(0, g.jsxs)(`a`, {
                    href: `/`,
                    className: `flex items-center gap-2.5 group min-w-0 shrink-0`,
                    "aria-label": `${x} Home`,
                    children: [(0, g.jsx)(`img`, {
                        src: C,
                        alt: x,
                        className: `h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full object-cover bg-white p-1 ring-2 ring-accent/40 shadow-xs transition-transform duration-300 group-hover:scale-105`,
                        onError: e => {
                            e.currentTarget.src = `/images/mtdc-logo.png`
                        }
                    }), (0, g.jsxs)(`div`, {
                        className: `flex flex-col leading-tight min-w-0`,
                        children: [(0, g.jsx)(`span`, {
                            className: `font-display text-xl sm:text-2xl xl:text-[26px] font-bold tracking-tight truncate max-w-[42vw] lg:max-w-[150px] xl:max-w-[180px] 2xl:max-w-[260px] ${w?`text-white`:`text-primary`}`,
                            children: x
                        }), (0, g.jsx)(`span`, {
                            className: `text-[8px] md:text-[9px] font-semibold tracking-[0.18em] uppercase mt-0.5 truncate max-w-[42vw] lg:max-w-[150px] xl:max-w-[180px] 2xl:max-w-[260px] ${w?`text-accent`:`text-primary/90`}`,
                            children: S
                        })]
                    })]
                }), (0, g.jsxs)(`nav`, {
                    className: `hidden lg:flex items-center gap-3 2xl:gap-5 text-[13px] 2xl:text-sm font-medium shrink-0 justify-end ${w?`text-white/85`:`text-stone-600`}`,
                    children: [_.map(e => (0, g.jsx)(`a`, {
                        href: e.href,
                        className: `relative py-1 transition-colors whitespace-nowrap after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${w?`hover:text-accent after:bg-accent`:`hover:text-primary after:bg-primary`}`,
                        children: e.label
                    }, e.label)), (0, g.jsxs)(`a`, {
                        href: `tel:${b}`,
                        onClick: () => h(),
                        className: `flex items-center gap-1.5 font-semibold transition-colors whitespace-nowrap ${w?`text-accent hover:text-white`:`text-primary hover:text-primary/80`}`,
                        children: [(0, g.jsx)(c, {
                            className: `w-4 h-4`
                        }), b]
                    }), (0, g.jsxs)(`a`, {
                        href: `/track-booking`,
                        className: `flex items-center gap-1.5 transition-colors whitespace-nowrap ${w?`text-white/85 hover:text-accent`:`text-primary hover:text-primary/80`}`,
                        children: [(0, g.jsx)(l, {
                            className: `w-4 h-4`
                        }), (0, g.jsx)(`span`, {
                            className: `hidden 2xl:inline`,
                            children: `Track`
                        })]
                    }), (0, g.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => d({
                            allowHotelSelection: !0
                        }),
                        className: `btn-book-now btn-shimmer btn-glow px-5 py-2.5 rounded-full text-xs flex items-center gap-2 whitespace-nowrap`,
                        children: [(0, g.jsx)(i, {
                            className: `w-3.5 h-3.5`
                        }), `Book Now`]
                    })]
                }), (0, g.jsxs)(`div`, {
                    className: `flex items-center gap-2 lg:hidden shrink-0`,
                    children: [(0, g.jsxs)(`a`, {
                        href: `tel:${b}`,
                        onClick: () => h(),
                        className: `btn-book-now btn-shimmer px-4 py-2 rounded-full text-[11px] flex items-center gap-1.5`,
                        children: [(0, g.jsx)(c, {
                            className: `w-3 h-3`
                        }), `Call`]
                    }), (0, g.jsx)(`button`, {
                        onClick: () => y(!o),
                        "aria-label": o ? `Close menu` : `Open menu`,
                        className: `p-2 ${w?`text-white`:`text-stone-700`}`,
                        children: o ? (0, g.jsx)(u, {
                            className: `w-6 h-6`
                        }) : (0, g.jsx)(s, {
                            className: `w-6 h-6`
                        })
                    })]
                })]
            }), o && (0, g.jsx)(`div`, {
                className: `lg:hidden bg-white border-t border-stone-100 shadow-lg animate-fade-in`,
                children: (0, g.jsxs)(`div`, {
                    className: `p-4 flex flex-col gap-3`,
                    children: [v.map((e, t) => (0, g.jsx)(`a`, {
                        href: e.href,
                        onClick: () => y(!1),
                        className: `text-stone-700 py-2 border-b border-stone-100 text-sm font-medium`,
                        style: {
                            animationDelay: `${t*40}ms`
                        },
                        children: e.label
                    }, e.label)), (0, g.jsxs)(`a`, {
                        href: `/track-booking`,
                        onClick: () => y(!1),
                        className: `flex items-center gap-2 text-primary py-2 border-b border-stone-100 text-sm font-semibold`,
                        children: [(0, g.jsx)(l, {
                            className: `w-4 h-4`
                        }), ` Track My Booking`]
                    }), (0, g.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => {
                            y(!1), d({
                                allowHotelSelection: !0
                            })
                        },
                        className: `btn-book-now btn-shimmer py-3 rounded-full text-xs mt-1 flex items-center justify-center gap-2`,
                        children: [(0, g.jsx)(i, {
                            className: `w-4 h-4`
                        }), ` Reserve Your Stay`]
                    })]
                })
            })]
        })
    },
    b = () => {
        let {
            phone_number: e,
            contact_email: t,
            brand_name: n,
            brand_tagline: r,
            logo_url: i
        } = f();
        return (0, g.jsxs)(`footer`, {
            id: `contact-us`,
            className: `bg-[hsl(220_28%_13%)] text-white/75 border-t-4 border-accent`,
            children: [(0, g.jsx)(`div`, {
                className: `section-padding pt-16 pb-6`,
                children: (0, g.jsxs)(`div`, {
                    className: `max-w-7xl mx-auto border-b border-white/10 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 justify-between`,
                    children: [(0, g.jsxs)(`div`, {
                        className: `flex items-center gap-4`,
                        children: [(0, g.jsx)(`img`, {
                            src: i,
                            alt: n,
                            className: `h-14 w-14 object-contain`,
                            onError: e => {
                                e.currentTarget.src = `/images/mtdc-logo.png`
                            }
                        }), (0, g.jsxs)(`div`, {
                            children: [(0, g.jsx)(`p`, {
                                className: `colophon text-accent/80`,
                                children: `Maharashtra Journal — Vol. XXVI`
                            }), (0, g.jsxs)(`p`, {
                                className: `display-serif text-3xl text-white tracking-tight`,
                                children: [n, ` · `, r]
                            })]
                        })]
                    }), (0, g.jsx)(`p`, {
                        className: `font-display italic text-white/70 max-w-sm text-right md:text-right`,
                        children: `"Maharashtra Unlimited — the official MTDC resort network, published from Mumbai since 1975."`
                    })]
                })
            }), (0, g.jsx)(`div`, {
                className: `section-padding pb-14`,
                children: (0, g.jsxs)(`div`, {
                    className: `max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10`,
                    children: [(0, g.jsxs)(`div`, {
                        className: `md:col-span-4`,
                        children: [(0, g.jsx)(`p`, {
                            className: `colophon text-accent mb-3`,
                            children: `The Publisher`
                        }), (0, g.jsx)(`p`, {
                            className: `text-sm leading-relaxed text-white/70 mb-6`,
                            children: `MTDC operates 38 resorts across the Konkan coast, the Sahyadri hills, the Ajanta and Ellora heritage belt, Maharashtra's tiger reserves and pilgrimage towns. Book direct at government tariff.`
                        }), (0, g.jsxs)(`div`, {
                            className: `flex flex-col gap-2 text-sm text-white/70`,
                            children: [(0, g.jsxs)(`a`, {
                                href: `tel:${e}`,
                                className: `flex items-center gap-2 hover:text-accent transition-colors`,
                                children: [(0, g.jsx)(c, {
                                    className: `w-4 h-4`
                                }), ` `, e]
                            }), (0, g.jsxs)(`span`, {
                                className: `flex items-center gap-2 break-all`,
                                children: [(0, g.jsx)(a, {
                                    className: `w-4 h-4 shrink-0`
                                }), ` `, t]
                            }), (0, g.jsxs)(`span`, {
                                className: `flex items-start gap-2`,
                                children: [(0, g.jsx)(o, {
                                    className: `w-4 h-4 mt-0.5 shrink-0`
                                }), ` Central Reservations, Apeejay House, Fort, Mumbai 400001`]
                            })]
                        })]
                    }), (0, g.jsxs)(`div`, {
                        className: `md:col-span-3`,
                        children: [(0, g.jsx)(`p`, {
                            className: `colophon text-accent mb-3`,
                            children: `Sections`
                        }), (0, g.jsxs)(`ul`, {
                            className: `text-sm space-y-2.5 text-white/70`,
                            children: [(0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/resorts`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Beach & Konkan Resorts`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/resorts`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Hill & Lake Retreats`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/resorts`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Heritage & Caves`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/resorts`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Wildlife & Nature Lodges`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/resorts`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Pilgrimage & City Stays`
                                })
                            })]
                        })]
                    }), (0, g.jsxs)(`div`, {
                        className: `md:col-span-3`,
                        children: [(0, g.jsx)(`p`, {
                            className: `colophon text-accent mb-3`,
                            children: `Guest Desk`
                        }), (0, g.jsxs)(`ul`, {
                            className: `text-sm space-y-2.5 text-white/70`,
                            children: [(0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/track-booking`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Track My Booking`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/sustainability`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Sustainability`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/about`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `About MTDC`
                                })
                            })]
                        })]
                    }), (0, g.jsxs)(`div`, {
                        className: `md:col-span-2`,
                        children: [(0, g.jsx)(`p`, {
                            className: `colophon text-accent mb-3`,
                            children: `Colophon`
                        }), (0, g.jsxs)(`ul`, {
                            className: `text-sm space-y-2.5 text-white/70`,
                            children: [(0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/legal-and-ownership`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Legal & Ownership`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/privacy-policy`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Privacy`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/terms-and-conditions`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Terms`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/cancellation-policy`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Cancellation`
                                })
                            }), (0, g.jsx)(`li`, {
                                children: (0, g.jsx)(`a`, {
                                    href: `/refund-policy`,
                                    className: `hover:text-accent transition-colors`,
                                    children: `Refunds`
                                })
                            })]
                        })]
                    })]
                })
            }), (0, g.jsx)(`div`, {
                className: `border-t border-white/10 py-5 section-padding text-center`,
                children: (0, g.jsxs)(`p`, {
                    className: `colophon text-white/50`,
                    children: [`© `, new Date().getFullYear(), ` · Maharashtra Tourism Development Corporation · All rights reserved`]
                })
            })]
        })
    };
export {
    y as n, h as r, b as t
};