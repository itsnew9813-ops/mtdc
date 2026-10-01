import {
    r as e
} from "./rolldown-runtime-hePW80VL.js";
import {
    n as t
} from "./jsx-runtime-DE3RlOCf.js";
var n = e(t(), 1),
    r = (e = .05) => {
        let t = (0, n.useRef)(null),
            [r, i] = (0, n.useState)(!1);
        return (0, n.useEffect)(() => {
            let n = t.current;
            if (!n) return;
            let r = new IntersectionObserver(([e]) => {
                e.isIntersecting && (i(!0), r.unobserve(n))
            }, {
                threshold: e,
                rootMargin: `0px 0px -50px 0px`
            });
            return r.observe(n), () => r.disconnect()
        }, [e]), {
            ref: t,
            isVisible: r
        }
    };
export {
    r as t
};