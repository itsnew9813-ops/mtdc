const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["assets/jspdf.es.min-CA52WviE.js", "assets/rolldown-runtime-hePW80VL.js", "assets/preload-helper-Czpn1I53.js", "assets/typeof-B5XbjTb1.js"]))) => i.map(i => d[i]);
import {
    t as e
} from "./preload-helper-Czpn1I53.js";
import {
    t
} from "./format-DSso9CUC.js";
var n = {
        phone: `9584192992`,
        email: `reservations@mtdcresorts.com`,
        website: `www.mtdcresorts.com`
    },
    r = (e, n) => {
        let r = (e || ``).toLowerCase(),
            i = (n || ``).toUpperCase().replace(/[^A-Z0-9]/g, ``).slice(0, 8);
        i || (i = `MT`, r.includes(`purple beds`) ? i = `PB` : r.includes(`select`) && (i = `VS`));
        let a = t(new Date, `yyMMdd`),
            o = Array.from({
                length: 6
            }, () => Math.floor(Math.random() * 10)).join(``);
        return `${i}${a}${o}`
    },
    i = () => `${46+Math.floor(Math.random()*54)}${Array.from({length:3},()=>Math.floor(Math.random()*10)).join(`
`)}`, a = [176, 68, 11], o = [23, 28, 38], s = [250, 144, 15], c = [255, 255, 255], l = [251, 246, 238], u = [23, 28, 38], d = [110, 115, 125], f = `/images/mtdc-logo.png`, p = async () => {
    try {
        let e = await fetch(f);
        if (!e.ok) return null;
        let t = await e.blob();
        return await new Promise((e, n) => {
            let r = new FileReader;
            r.onload = () => e(String(r.result)), r.onerror = n, r.readAsDataURL(t)
        })
    } catch {
        return null
    }
}, m = async (r, i, f, m = {}) => {
    let {
        default: h
    } = await e(async () => {
        let {
            default: e
        } = await
        import (`./jspdf.es.min-CA52WviE.js`);
        return {
            default: e
        }
    }, __vite__mapDeps([0, 1, 2, 3])), g = { ...n,
        ...m
    }, _ = new h({
        compress: !0
    }), v = _.internal.pageSize.getWidth(), y = _.internal.pageSize.getHeight(), b = v - 28, x = 0;
    _.setFillColor(...o), _.rect(0, 0, v, 48, `F`), _.setFillColor(...a), _.rect(0, 0, 6, 48, `F`), _.setFillColor(...s), _.rect(0, 48, v, 2.5, `F`);
    let S = await p();
    if (_.setFillColor(...c), _.circle(26, 24, 11, `F`), S) try {
        _.addImage(S, `PNG`, 17, 15, 18, 18, void 0, `FAST`)
    } catch {} else _.setTextColor(...a), _.setFont(`helvetica`, `bold`), _.setFontSize(11), _.text(`MTDC`, 26, 25.8, {
        align: `center`
    });
    _.setTextColor(...s), _.setFontSize(8), _.setFont(`helvetica`, `bold`), _.text(`M T D C`, 44, 14, {
        charSpace: 3
    }), _.setTextColor(...c), _.setFontSize(17), _.setFont(`helvetica`, `bold`), _.text(`Resorts & Hotels`, 44, 24), _.setFontSize(7), _.setFont(`helvetica`, `italic`), _.setTextColor(215, 210, 200), _.text(`Maharashtra Tourism Development Corporation - Maharashtra Unlimited`, 44, 31), _.setFontSize(7), _.setFont(`helvetica`, `normal`), _.setTextColor(225, 222, 215), _.text(`Web   ${g.website}`, v - 14, 15, {
        align: `right`
    }), _.text(`Mail  ${g.email}`, v - 14, 21, {
        align: `right`
    }), _.text(`Tel   +91 ${g.phone}`, v - 14, 27, {
        align: `right`
    }), _.setFont(`helvetica`, `bold`), _.setTextColor(...s), _.text(`E · VOUCHER`, v - 14, 35, {
        align: `right`
    }), x = 58, _.setFillColor(...l), _.roundedRect(14, x, b, 30, 3, 3, `F`), _.setDrawColor(...s), _.setLineWidth(.6), _.roundedRect(14, x, b, 30, 3, 3, `S`), _.setDrawColor(...a), _.setLineWidth(.3), _.line(v / 2, x + 5, v / 2, x + 25), _.setFontSize(7.5), _.setFont(`helvetica`, `normal`), _.setTextColor(...d), _.text(`STATUS`, 22, x + 9), _.setFontSize(13), _.setFont(`helvetica`, `bold`), _.setTextColor(...a), _.text(`BOOKING CONFIRMED`, 22, x + 18), _.setFontSize(7), _.setFont(`helvetica`, `italic`), _.setTextColor(...d), _.text(`Booked ${t(new Date,`dd MMM yyyy, hh:mm a`)}`, 22, x + 25), _.setFontSize(7.5), _.setFont(`helvetica`, `normal`), _.setTextColor(...d), _.text(`BOOKING ID`, v / 2 + 8, x + 9), _.setFontSize(12), _.setFont(`helvetica`, `bold`), _.setTextColor(...u), _.text(i, v / 2 + 8, x + 17), _.setFontSize(7.5), _.setFont(`helvetica`, `normal`), _.setTextColor(...d), _.text(`PNR`, v - 14 - 8, x + 9, {
        align: `right`
    }), _.setFontSize(11), _.setFont(`helvetica`, `bold`), _.setTextColor(...u), _.text(f, v - 14 - 8, x + 17, {
        align: `right`
    }), x += 38;
    let C = e => {
            _.setFillColor(...s), _.rect(14, x, 3, 6, `F`), _.setFontSize(9), _.setFont(`helvetica`, `bold`), _.setTextColor(...o), _.text(e, 21, x + 4.6, {
                charSpace: .8
            }), _.setDrawColor(220, 220, 215), _.setLineWidth(.3), _.line(69, x + 3, v - 14, x + 3), x += 11
        },
        w = (e, t, n = !1) => {
            x > y - 45 && (_.addPage(), x = 20), _.setFont(`helvetica`, `normal`), _.setFontSize(8.5), _.setTextColor(...d), _.text(e, 18, x), _.setFont(`helvetica`, n ? `bold` : `normal`), _.setTextColor(...u);
            let r = _.splitTextToSize(t, b - 58);
            _.text(r, 66, x), x += 6.5 * r.length, _.setDrawColor(238, 236, 230), _.setLineWidth(.2), _.line(18, x - 3, v - 14 - 4, x - 3), x += 1
        };
    C(`PROPERTY DETAILS`), w(`Property`, r.hotelName, !0), w(`Address`, r.address), w(`Type`, r.isResort ? `Resort` : `Hotel`), w(`Category`, r.roomCategory, !0), x += 5, C(`YOUR STAY`), w(`Check-in`, `${t(r.checkIn,`EEE, dd MMM yyyy`)}  ·  2:00 PM`), w(`Check-out`, `${t(r.checkOut,`EEE, dd MMM yyyy`)}  ·  12:00 PM`), w(`Nights`, String(r.totalNights), !0), w(r.isResort ? `Cottages` : `Rooms`, r.numRooms), w(`Guests`, r.guests), x += 5, C(`GUEST INFORMATION`), w(`Name`, r.guestName, !0), w(`Mobile`, `+91 ${r.mobile}`), r.email && w(`Email`, r.email), r.specialRequest && w(`Request`, r.specialRequest), x += 6, x > y - 65 && (_.addPage(), x = 20), _.setFillColor(253, 249, 240), _.roundedRect(14, x, b, 30, 3, 3, `F`), _.setDrawColor(...s), _.setLineWidth(.4), _.roundedRect(14, x, b, 30, 3, 3, `S`), _.setFontSize(8.5), _.setFont(`helvetica`, `bold`), _.setTextColor(140, 90, 0), _.text(`PAYMENT & CANCELLATION POLICY`, 20, x + 7), _.setFont(`helvetica`, `normal`), _.setFontSize(7.5), _.setTextColor(90, 70, 20), _.text(`- Booking confirmed on Full Payment only. Pay at Reception is NOT available.`, 20, x + 14), _.text(`- Full refund if cancelled at least 1 day before check-in.`, 20, x + 20), _.text(`- Instant discount: 10% off on UPI  |  15% off on Credit Card.`, 20, x + 26), x += 36, x > y - 45 && (_.addPage(), x = 20), _.setFillColor(248, 248, 246), _.roundedRect(14, x, b, 22, 3, 3, `F`), _.setFontSize(7.5), _.setFont(`helvetica`, `bold`), _.setTextColor(80, 80, 80), _.text(`TERMS & CONDITIONS`, 20, x + 7), _.setFont(`helvetica`, `normal`), _.setFontSize(6.8), _.setTextColor(120, 120, 120), _.text(`- Early check-in / late check-out subject to availability and additional charges.`, 20, x + 12.5), _.text(`- Government-issued photo ID mandatory at check-in.`, 20, x + 16.5), _.text(`- MTDC reserves the right to modify or cancel reservations per operational policy.`, 20, x + 20.5), x += 28, x > y - 30 && (_.addPage(), x = 20), _.setDrawColor(200, 200, 195), _.setLineWidth(.2), _.line(14, x, v - 14, x), x += 5, _.setFontSize(6.8), _.setTextColor(150, 150, 145), _.setFont(`helvetica`, `italic`), _.text(`This is a digitally signed booking confirmation. No physical signature is required.`, v / 2, x, {
        align: `center`
    }), x += 4, _.setFont(`helvetica`, `bold`), _.setTextColor(...a), _.text(`Signature · MTDC-${i.slice(-8)}-${f}`, v / 2, x, {
        align: `center`
    });
    let T = y - 16;
    return _.setFillColor(...o), _.rect(0, T - 2, v, 18, `F`), _.setFillColor(...s), _.rect(0, T - 2, v, 1.5, `F`), _.setTextColor(...s), _.setFontSize(8), _.setFont(`helvetica`, `bold`), _.text(`MTDC RESORTS & HOTELS`, v / 2, T + 5, {
        align: `center`
    }), _.setTextColor(210, 220, 210), _.setFontSize(6.5), _.setFont(`helvetica`, `italic`), _.text(`Maharashtra Tourism Development Corporation — Maharashtra Unlimited`, v / 2, T + 9, {
        align: `center`
    }), _.setFont(`helvetica`, `normal`), _.text(`${g.website}  ·  ${g.email}  ·  +91 ${g.phone}`, v / 2, T + 13, {
        align: `center`
    }), _
};
export {
    m as n, i as r, r as t
};