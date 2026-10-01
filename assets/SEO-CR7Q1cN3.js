import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t
} from "./jsx-runtime-DE3RlOCf.js";
var n = e(t(), 1),
    r = `https://www.mtdcresorts.com`,
    i = (e, t, n, r) => {
        let i = document.head.querySelector(e);
        i || (i = document.createElement(`meta`), i.setAttribute(t, n), document.head.appendChild(i)), i.setAttribute(`content`, r)
    },
    a = (e, t) => {
        let n = document.head.querySelector(`link[rel="${e}"]`);
        n || (n = document.createElement(`link`), n.setAttribute(`rel`, e), document.head.appendChild(n)), n.setAttribute(`href`, t)
    },
    o = ({
        title: e,
        description: t,
        keywords: o,
        canonicalPath: s,
        image: c,
        jsonLd: l,
        noindex: u
    }) => ((0, n.useEffect)(() => {
        document.title = e, i(`meta[name="description"]`, `name`, `description`, t), o && i(`meta[name="keywords"]`, `name`, `keywords`, o), i(`meta[property="og:title"]`, `property`, `og:title`, e), i(`meta[property="og:description"]`, `property`, `og:description`, t), i(`meta[property="og:type"]`, `property`, `og:type`, `website`), c && i(`meta[property="og:image"]`, `property`, `og:image`, c), i(`meta[name="twitter:title"]`, `name`, `twitter:title`, e), i(`meta[name="twitter:description"]`, `name`, `twitter:description`, t), c && i(`meta[name="twitter:image"]`, `name`, `twitter:image`, c), i(`meta[name="twitter:card"]`, `name`, `twitter:card`, `summary_large_image`), i(`meta[name="robots"]`, `name`, `robots`, u ? `noindex, nofollow, noarchive, nosnippet` : `index, follow, max-image-preview:large`), i(`meta[name="googlebot"]`, `name`, `googlebot`, u ? `noindex, nofollow` : `index, follow`);
        let n = `${r}${s||(typeof window<`u`?window.location.pathname:`/`)}`;
        a(`canonical`, n), i(`meta[property="og:url"]`, `property`, `og:url`, n);
        let d = document.head.querySelector(`script[data-seo-jsonld="true"]`);
        if (d && d.remove(), l) {
            let e = document.createElement(`script`);
            e.type = `application/ld+json`, e.setAttribute(`data-seo-jsonld`, `true`), e.text = JSON.stringify(l), document.head.appendChild(e)
        }
    }, [e, t, o, s, c, JSON.stringify(l), u]), null);
export {
    o as t
};