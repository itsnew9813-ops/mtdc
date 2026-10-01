var e = `mtdc-booking-options`,
    t = () => {
        let e = document.getElementById(`book`);
        return e ? (e.scrollIntoView({
            behavior: `smooth`,
            block: `start`
        }), window.dispatchEvent(new CustomEvent(`mtdc:booking-options-changed`)), !0) : !1
    },
    n = (n = {}) => {
        let {
            bookingPath: r,
            ...i
        } = n;
        if (!(typeof window > `u`)) {
            try {
                Object.keys(i).length > 0 ? window.sessionStorage.setItem(e, JSON.stringify(i)) : window.sessionStorage.removeItem(e)
            } catch {}!r && t() || (window.location.href = r ? `${r}#book` : `/#book`)
        }
    },
    r = n,
    i = () => {
        typeof window > `u` || window.dispatchEvent(new CustomEvent(`mtdc:close-booking-dialog`))
    };
export {
    r as i, i as n, n as r, e as t
};