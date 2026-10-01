import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t
} from "./jsx-runtime-DE3RlOCf.js";
import {
    t as n
} from "./client-B0gse2_o.js";
var r = e(t(), 1),
    i = `mtdc_site_settings`,
    a = 3e5,
    o = {
        phone_number: `9584192992`,
        whatsapp_number: `9584192992`,
        contact_email: `reservations@mtdcresorts.com`,
        upi_id: ``,
        booking_id_prefix: `MT`,
        site_domain: `mtdcresorts.com`,
        brand_name: `MTDC`,
        brand_tagline: `Maharashtra Unlimited — official state tourism stays`,
        logo_url: `/images/mtdc-logo.png`,
        hero_image_1: `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/a8b8eaa1-76f4-497d-b8a6-b2fa41ccf82c.webp`,
        hero_image_2: `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/4e720cac-90b8-46d1-b562-e9b2e52f8b3f.webp`,
        hero_image_3: `https://mtdc-main.s3.amazonaws.com/mtdc-cms-migrated/4e4c7510-4de5-4b10-bff0-25d7468309ac.webp`,
        whatsapp_fab_enabled: !0,
        discount_enabled: !0,
        discount_code: `CC15`,
        discount_percent: 15,
        discount_title: `Credit Card Offer`,
        discount_note: `Credit Card payment required at the payment step.`
    },
    s = e => (e || ``).trim().replace(/^https?:\/\//i, ``).replace(/^www\./i, ``).replace(/\/+$/, ``),
    c = e => `https://www.${s(e)||`mtdcresorts.com`}`,
    l = null,
    u = null,
    d = null,
    f = 0,
    p = new Set,
    m = () => {
        try {
            let e = localStorage.getItem(i);
            if (!e) return null;
            let {
                value: t,
                ts: n
            } = JSON.parse(e);
            if (Date.now() - n < a) return { ...o,
                ...t
            }
        } catch {}
        return null
    },
    h = e => {
        l = e, p.forEach(t => t(e))
    },
    g = async () => {
        let [{
            data: e
        }, {
            data: t
        }] = await Promise.all([n.from(`site_settings`).select(`key,value`), n.from(`payment_config`).select(`upi_id`).limit(1).maybeSingle()]), r = {};
        (e || []).forEach(e => {
            r[e.key] = e.value
        });
        let a = {
            phone_number: r.phone_number || r.phone || o.phone_number,
            whatsapp_number: r.whatsapp_number || r.phone_number || o.whatsapp_number,
            contact_email: r.contact_email || o.contact_email,
            upi_id: t ?.upi_id || o.upi_id,
            booking_id_prefix: (r.booking_id_prefix || o.booking_id_prefix).toUpperCase(),
            site_domain: s(r.site_domain) || o.site_domain,
            brand_name: r.brand_name || o.brand_name,
            brand_tagline: r.brand_tagline || o.brand_tagline,
            logo_url: r.logo_url || o.logo_url,
            hero_image_1: r.hero_image_1 || o.hero_image_1,
            hero_image_2: r.hero_image_2 || o.hero_image_2,
            hero_image_3: r.hero_image_3 || o.hero_image_3,
            whatsapp_fab_enabled: String(r.whatsapp_fab_enabled ?? `true`) !== `false`,
            discount_enabled: String(r.discount_enabled ?? `true`) !== `false`,
            discount_code: (r.discount_code || o.discount_code).toUpperCase(),
            discount_percent: Math.max(0, Math.min(100, Number(r.discount_percent ?? o.discount_percent) || 0)),
            discount_title: r.discount_title || o.discount_title,
            discount_note: r.discount_note || o.discount_note
        };
        try {
            localStorage.setItem(i, JSON.stringify({
                value: a,
                ts: Date.now()
            }))
        } catch {}
        return h(a), a
    },
    _ = () => (u ||= g().finally(() => {
        u = null
    }), u),
    v = () => {
        let [e, t] = (0, r.useState)(o);
        return (0, r.useEffect)(() => {
            let e = !0,
                r = n => {
                    e && t(n)
                },
                i = l ?? m();
            return i && r(i), p.add(r), f += 1, _(), d ||= n.channel(`site-settings-live`).on(`postgres_changes`, {
                event: `*`,
                schema: `public`,
                table: `site_settings`
            }, () => {
                _()
            }).on(`postgres_changes`, {
                event: `*`,
                schema: `public`,
                table: `payment_config`
            }, () => {
                _()
            }).subscribe(), () => {
                e = !1, p.delete(r), --f, f <= 0 && d && (n.removeChannel(d), d = null)
            }
        }, []), e
    };
export {
    c as n, v as r, s as t
};