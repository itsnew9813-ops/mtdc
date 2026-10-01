const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/AboutSection-DnO4cTfx.js", "assets/jsx-runtime-DE3RlOCf.js", "assets/rolldown-runtime-hePW80VL.js", "assets/award-CMO9DmIN.js", "assets/createLucideIcon-BZ5eRbaK.js", "assets/clock-HkbhqKQQ.js", "assets/landmark-DhYuvtjx.js", "assets/shield-DZSm9JEi.js", "assets/useScrollAnimation-CxH8JxXs.js", "assets/useSiteSettings-8fHJtRuj.js", "assets/client-B0gse2_o.js", "assets/GlanceSection-BBYcm0ZJ.js", "assets/building-2-BdRnaXvW.js", "assets/sparkles-C0UsdKnn.js", "assets/tree-pine-BhBIvw-Y.js", "assets/waves-Dxc42WgO.js", "assets/bookingDialog-n1isumFq.js", "assets/HotelsSection-CuBfXx91.js", "assets/router-compat-DVALc1LS.js", "assets/arrow-right-BAISyOlv.js", "assets/calendar-check-9weHorr-.js", "assets/map-pin-BrptJX3m.js", "assets/star-eZN0kLzH.js", "assets/useLiveHotels-BO9mdoya.js", "assets/siteData-CLhXjX0b.js", "assets/hotelDetails-Xb693_T9.js", "assets/OffersSection-BNnzKTJN.js", "assets/offerDetails-BgVj_evy.js", "assets/CircuitsSection-vzpr7ArA.js", "assets/EventsSection-B83m0Dor.js", "assets/phone-BF5r-6hK.js", "assets/usePhoneNumber-DuYa7FER.js", "assets/ExperiencesSection-O4AolO2E.js", "assets/WhyBookSection-fSLMMA3b.js"]))) => i.map(i => d[i]);
import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t,
    t as n
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t as r
} from "./router-compat-DVALc1LS.js";
import {
    t as i
} from "./arrow-right-BAISyOlv.js";
import {
    t as a
} from "./HomeBookingSection-DFvik2xq.js";
import {
    t as o
} from "./calendar-check-9weHorr-.js";
import {
    n as s
} from "./chevron-up-xhe2r3JA.js";
import {
    r as c
} from "./bookingDialog-n1isumFq.js";
import {
    t as l
} from "./preload-helper-Czpn1I53.js";
import {
    r as u
} from "./useSiteSettings-8fHJtRuj.js";
import {
    n as d,
    t as f
} from "./Footer-C9T4cJ1t.js";
import {
    t as p
} from "./SEO-CR7Q1cN3.js";
var m = e(t(), 1),
    h = n(),
    g = () => (0, h.jsx)(`div`, {
        className: `min-h-[16rem] w-full bg-muted/40`,
        "aria-hidden": `true`
    }),
    _ = ({
        children: e
    }) => {
        let t = (0, m.useRef)(null),
            [n, r] = (0, m.useState)(!1);
        return (0, m.useEffect)(() => {
            if (n) return;
            let e = t.current;
            if (!e || typeof IntersectionObserver > `u`) {
                r(!0);
                return
            }
            let i = new IntersectionObserver(e => {
                e.some(e => e.isIntersecting) && (r(!0), i.disconnect())
            }, {
                rootMargin: `600px 0px`
            });
            return i.observe(e), () => i.disconnect()
        }, [n]), (0, h.jsx)(`div`, {
            ref: t,
            style: {
                contentVisibility: `auto`,
                containIntrinsicSize: `auto 640px`
            },
            children: n ? (0, h.jsx)(m.Suspense, {
                fallback: (0, h.jsx)(g, {}),
                children: e
            }) : (0, h.jsx)(g, {})
        })
    },
    v = `/images/hero-1.jpg`,
    y = `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/a8b8eaa1-76f4-497d-b8a6-b2fa41ccf82c.webp`,
    b = [{
        story: `Tadoba Wildlife`,
        alt: `MTDC wildlife lodge in tiger country at Tadoba`,
        image: `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/a26c3cdc-22a0-43c6-9f9e-c309c519a41d.webp`
    }, {
        story: `Matheran Hills`,
        alt: `MTDC hill resort at Matheran`,
        image: `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/f216510f-5a2f-4e89-b426-41d0030c1147.webp`
    }, {
        story: `Ganpatipule Shores`,
        alt: `MTDC beach resort at Ganpatipule`,
        image: `https://mtdc-main.s3.ap-south-1.amazonaws.com/images/ba6bf9fa-815c-46bb-906d-a8478abd96a0.webp`
    }, {
        story: `Elephanta Island`,
        alt: `MTDC resort near Elephanta caves`,
        image: `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/49fe4e17-fdb4-4d18-87cf-be3e2d138128.webp`
    }],
    x = [{
        story: `Konkan Coastline`,
        alt: `MTDC beach resort on the Konkan coast`
    }, {
        story: `Sahyadri Highlands`,
        alt: `MTDC hill resort in the Sahyadri range`
    }, {
        story: `Ajanta & Ellora`,
        alt: `MTDC heritage resort near Ajanta and Ellora caves`
    }],
    S = () => {
        let [e, t] = (0, m.useState)(0), n = u(), a = (0, m.useMemo)(() => [...x.map((e, t) => ({ ...e,
            image: [n.hero_image_1, n.hero_image_2, n.hero_image_3][t] || v
        })), ...b], [n.hero_image_1, n.hero_image_2, n.hero_image_3]), [l, d] = (0, m.useState)(!1);
        return (0, m.useEffect)(() => {
            let e = setTimeout(() => d(!0), 1200);
            return () => clearTimeout(e)
        }, []), (0, m.useEffect)(() => {
            if (!l) return;
            let e = setInterval(() => t(e => (e + 1) % a.length), 3500);
            return () => clearInterval(e)
        }, [a.length, l]), (0, h.jsxs)(`section`, {
            className: `relative h-[78svh] min-h-[520px] w-full overflow-hidden bg-[#101725] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]`,
            children: [(0, h.jsx)(`div`, {
                className: `absolute inset-0 flex h-full w-full transition-transform duration-700 ease-out`,
                style: {
                    transform: `translateX(-${e*100}%)`
                },
                children: a.map((t, n) => (0, h.jsxs)(`div`, {
                    className: `relative min-w-full h-full overflow-hidden`,
                    "aria-hidden": n !== e,
                    children: [(n === 0 || l) && (0, h.jsx)(`img`, {
                        src: n === 0 && t.image === y ? `/images/hero-main-1280.webp` : t.image,
                        srcSet: n === 0 && t.image === y ? `/images/hero-main-720.webp 720w, /images/hero-main-1280.webp 1280w` : void 0,
                        sizes: n === 0 ? `100vw` : void 0,
                        alt: t.alt,
                        className: `h-full w-full object-cover`,
                        loading: n === 0 ? `eager` : `lazy`,
                        decoding: `async`,
                        fetchPriority: n === 0 ? `high` : `low`,
                        onError: e => {
                            e.currentTarget.src = v
                        }
                    }), (0, h.jsx)(`div`, {
                        className: `absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85`
                    })]
                }, n))
            }), (0, h.jsxs)(`div`, {
                className: `relative z-10 flex h-[78svh] min-h-[520px] flex-col items-center justify-center px-5 pb-20 pt-16 text-center`,
                children: [(0, h.jsxs)(`h1`, {
                    className: `display-serif max-w-4xl text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl`,
                    children: [`Maharashtra Unlimited`, (0, h.jsx)(`span`, {
                        className: `mt-2 block font-display text-2xl italic text-accent sm:text-4xl lg:text-5xl`,
                        children: `38 official MTDC resorts`
                    })]
                }), (0, h.jsxs)(`div`, {
                    className: `mt-8 flex flex-col items-center gap-3 sm:flex-row`,
                    children: [(0, h.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => c(),
                        className: `btn-shimmer btn-glow inline-flex items-center gap-2 rounded-md bg-primary px-9 py-4 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] transition-transform hover:scale-[1.03] hover:bg-primary/90 active:scale-95 sm:text-sm`,
                        children: [(0, h.jsx)(o, {
                            className: `h-4 w-4`
                        }), `Reserve Your Stay`]
                    }), (0, h.jsxs)(r, {
                        to: `/resorts`,
                        className: `inline-flex items-center gap-2 rounded-md border border-white/50 bg-white/10 px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:text-sm`,
                        children: [`View All Resorts`, (0, h.jsx)(i, {
                            className: `h-4 w-4`
                        })]
                    })]
                }), (0, h.jsxs)(`div`, {
                    className: `mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-[11px]`,
                    children: [(0, h.jsx)(`span`, {
                        children: `Government tariff`
                    }), (0, h.jsx)(`span`, {
                        className: `hidden h-1 w-1 rounded-full bg-accent sm:block`
                    }), (0, h.jsx)(`span`, {
                        children: `Best rate guarantee`
                    }), (0, h.jsx)(`span`, {
                        className: `hidden h-1 w-1 rounded-full bg-accent sm:block`
                    }), (0, h.jsx)(`span`, {
                        children: `24/7 support`
                    })]
                })]
            }), (0, h.jsx)(`div`, {
                className: `absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2`,
                children: a.map((n, r) => (0, h.jsx)(`button`, {
                    onClick: () => t(r),
                    className: `h-1 rounded-full transition-all ${r===e?`w-10 bg-accent`:`w-4 bg-white/40`}`,
                    "aria-label": `Show ${n.story}`
                }, r))
            }), (0, h.jsx)(s, {
                className: `absolute bottom-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 animate-bounce text-white/50`
            })]
        })
    },
    C = (0, m.lazy)(() => l(() =>
        import (`./AboutSection-DnO4cTfx.js`), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))),
    w = (0, m.lazy)(() => l(() =>
        import (`./GlanceSection-BBYcm0ZJ.js`), __vite__mapDeps([11, 1, 2, 4, 12, 6, 13, 14, 15, 16, 8]))),
    T = (0, m.lazy)(() => l(() =>
        import (`./HotelsSection-CuBfXx91.js`), __vite__mapDeps([17, 1, 2, 18, 19, 4, 20, 21, 22, 16, 8, 23, 10, 24, 25]))),
    E = (0, m.lazy)(() => l(() =>
        import (`./OffersSection-BNnzKTJN.js`), __vite__mapDeps([26, 1, 2, 18, 19, 4, 8, 24, 27]))),
    D = (0, m.lazy)(() => l(() =>
        import (`./CircuitsSection-vzpr7ArA.js`), __vite__mapDeps([28, 1, 2, 8, 24]))),
    O = (0, m.lazy)(() => l(() =>
        import (`./EventsSection-B83m0Dor.js`), __vite__mapDeps([29, 1, 2, 30, 4, 8, 31, 9, 10]))),
    k = (0, m.lazy)(() => l(() =>
        import (`./ExperiencesSection-O4AolO2E.js`), __vite__mapDeps([32, 1, 2, 8, 24]))),
    A = (0, m.lazy)(() => l(() =>
        import (`./WhyBookSection-fSLMMA3b.js`), __vite__mapDeps([33, 1, 2, 8, 24]))),
    j = () => (0, h.jsxs)(h.Fragment, {
        children: [(0, h.jsx)(p, {
            title: `MTDC Official Website — Maharashtra Tourism Resorts & Online Booking`,
            description: `Official Maharashtra Tourism Development Corporation website. Book 38 MTDC resorts direct — Konkan beaches, Sahyadri hills, Ajanta & Ellora, Tadoba wildlife lodges and Shirdi stays at government tariff.`,
            keywords: `MTDC, MTDC resorts, Maharashtra Tourism, Tarkarli resort, Ganpatipule resort, Matheran MTDC, Malshej Ghat resort, Ajanta Ellora stay, Tadoba resort, Shirdi MTDC, Maharashtra Unlimited`,
            canonicalPath: `/`,
            image: `/images/mtdc-logo.png`,
            jsonLd: {
                "@context": `https://schema.org`,
                "@type": `Hotel`,
                name: `MTDC — Maharashtra Tourism Development Corporation`,
                url: `https://www.mtdcresorts.com`,
                logo: `https://www.mtdcresorts.com/images/mtdc-logo.png`,
                description: `Maharashtra Unlimited — the official MTDC resort network. Book beach resorts on the Konkan coast, Sahyadri hill retreats, Ajanta & Ellora heritage stays, wildlife lodges at Tadoba and Pench, and pilgrimage stays at Shirdi. Government tariff, book direct.`,
                telephone: `+911800-309-9050`,
                email: `reservations@mtdcresorts.com`,
                numberOfRooms: 1200
            }
        }), (0, h.jsx)(d, {
            transparent: !0
        }), (0, h.jsx)(S, {}), (0, h.jsx)(a, {}), (0, h.jsx)(_, {
            children: (0, h.jsx)(C, {})
        }), (0, h.jsx)(_, {
            children: (0, h.jsx)(w, {})
        }), (0, h.jsx)(_, {
            children: (0, h.jsx)(T, {})
        }), (0, h.jsx)(f, {})]
    });
export {
    j as component
};