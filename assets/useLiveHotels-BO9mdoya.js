import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t as n
} from "./client-B0gse2_o.js";
import {
    r
} from "./siteData-CLhXjX0b.js";
import {
    r as i,
    t as a
} from "./hotelDetails-Xb693_T9.js";
var o = e(t(), 1),
    s = `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80`,
    c = /(gstatic\.com|encrypted-tbn|\/logo|\/icon|favicon|sprite|pixel|inr-hotel-tab|Content\/img\/|logo-big|couple\.png|view-from|-banner|_banner|banner\.jpg|exterior|facade|swimming-pool|pool-view|garden-view|balcony-view|sunset|mountain|hillview|hill-view|landscape|aerial|beach-hotels|golf-hotels)/i,
    l = e => Array.isArray(e) ? e.map(e => typeof e == `string` ? e.trim().replace(/&amp;/g, `&`) : ``).filter(e => e && /^https?:\/\//.test(e) && !c.test(e)) : [],
    u = e => {
        let t = (e || ``).toLowerCase();
        return t.includes(`wildlife`) || t.includes(`lodge`) ? `Lodge` : t.includes(`heritage`) || t.includes(`city`) ? `Hotel` : `Resort`
    },
    d = (e, t) => {
        let n = (t || ``).trim();
        return n ? e.toLowerCase().includes(n.toLowerCase()) ? e : `${e}, ${n}` : e
    },
    f = e => {
        let t = e.hero_image && !c.test(e.hero_image) ? e.hero_image : ``,
            n = l(e.gallery),
            r = e.city || ``;
        return {
            name: e.name,
            displayName: d(e.name, r),
            city: r,
            address: e.address || ``,
            location: [r, e.state].filter(Boolean).join(`, `),
            image: t || n[0] || `/images/hotel-1.jpg`,
            rating: 4.6,
            type: u(e.category || ``),
            category: e.category || `Resort`,
            state: e.state || `Maharashtra`,
            slug: e.slug || a(e.name),
            basePrice: Number(e.base_price) || 0
        }
    },
    p = (e, t = []) => {
        let n = Number(e.base_price) || 5e3,
            r = l(e.images),
            i = r[0] || s,
            a = Array.isArray(e.amenities) ? e.amenities : [];
        return {
            name: e.name,
            description: e.description || ``,
            price: `₹${n.toLocaleString(`en-IN`)}`,
            priceNum: n,
            size: e.size_sqft ? `${e.size_sqft} sq ft` : `—`,
            maxGuests: e.max_occupancy || 4,
            amenities: a,
            image: i,
            gallery: r.length ? r : [i]
        }
    },
    m = {
        props: [],
        rooms: [],
        loaded: !1
    },
    h = new Set,
    g = () => h.forEach(e => e()),
    _ = !1;
async function v() {
    let [{
        data: e
    }, {
        data: t
    }] = await Promise.all([n.from(`properties`).select(`*`).eq(`active`, !0).order(`sort_order`).order(`name`), n.from(`rooms`).select(`*`).eq(`active`, !0).order(`sort_order`)]);
    m = {
        props: e || [],
        rooms: t || [],
        loaded: !0
    }, g()
}

function y() {
    _ || (_ = !0, v(), n.channel(`live-hotels-storefront`).on(`postgres_changes`, {
        event: `*`,
        schema: `public`,
        table: `properties`
    }, () => v()).on(`postgres_changes`, {
        event: `*`,
        schema: `public`,
        table: `rooms`
    }, () => v()).subscribe())
}

function b() {
    let [, e] = (0, o.useState)(0), [t, n] = (0, o.useState)(!1);
    return (0, o.useEffect)(() => {
        n(!0), y();
        let t = () => e(e => e + 1);
        return h.add(t), () => {
            h.delete(t)
        }
    }, []), t ? m : {
        props: [],
        rooms: [],
        loaded: !1
    }
}
var x = e => {
    let t = (e.location || ``).split(`,`)[0].trim();
    return { ...e,
        city: t,
        address: ``,
        displayName: d(e.name, t),
        slug: a(e.name),
        basePrice: 0
    }
};

function S() {
    let e = b();
    return !e.loaded || e.props.length === 0 ? r.map(e => x(e)) : e.props.map(f)
}

function C(e) {
    let t = b(),
        n = e ? t.props.find(t => (t.slug || a(t.name)) === e) : void 0;
    if (n) {
        let e = f(n),
            r = [...e.image ? [e.image] : [], ...l(n.gallery)],
            a = t.rooms.filter(e => e.property_id === n.id).map(e => p(e, r)),
            o = i(e.location, e.type, e.name, e.category, e.image),
            s = a.length ? a : o.rooms,
            c = l(n.gallery),
            u = c.length ? c : [e.image, ...s.map(e => e.image)].filter(Boolean);
        return {
            hotel: e,
            detail: {
                description: n.description || o.description,
                address: n.address || o.address,
                checkIn: `2:00 PM`,
                checkOut: `12:00 PM`,
                rooms: s,
                amenities: Array.isArray(n.amenities) && n.amenities.length ? n.amenities : o.amenities,
                gallery: u,
                coordinates: {
                    lat: n.latitude == null ? o.coordinates.lat : Number(n.latitude),
                    lng: n.longitude == null ? o.coordinates.lng : Number(n.longitude)
                },
                highlights: Array.isArray(n.highlights) && n.highlights.length ? n.highlights : o.highlights
            },
            loading: !1
        }
    }
    let o = r.find(t => a(t.name) === e);
    if (!o) return {
        hotel: null,
        detail: null,
        loading: !t.loaded
    };
    let s = x(o);
    return {
        hotel: s,
        detail: i(s.location, s.type, s.name, s.category, s.image),
        loading: !1
    }
}
export {
    S as n, d as r, C as t
};