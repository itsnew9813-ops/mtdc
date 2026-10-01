function e(e) {
    return e > 7500 ? 18 : 5
}

function t(e, t) {
    let n = e / (1 + t / 100),
        r = e - n;
    return {
        base: Math.round(n),
        tax: Math.round(r),
        rate: t
    }
}

function n(e) {
    let n = new Map;
    for (let r of e) {
        if (r.amount <= 0) continue;
        let {
            base: e,
            tax: i
        } = t(r.amount, r.rate), a = n.get(r.rate);
        a ? (a.base += e, a.tax += i) : n.set(r.rate, {
            label: r.label,
            rate: r.rate,
            base: e,
            tax: i
        })
    }
    let r = [...n.values()].sort((e, t) => e.rate - t.rate);
    return {
        lines: r,
        taxableValue: r.reduce((e, t) => e + t.base, 0),
        totalTax: r.reduce((e, t) => e + t.tax, 0)
    }
}
export {
    n,
    t as r,
    e as t
};