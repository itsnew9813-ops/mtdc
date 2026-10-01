import {
    t as e
} from "./client-B0gse2_o.js";
async function t() {
    try {
        let {
            data: t
        } = await e.from(`site_settings`).select(`value`).eq(`key`, `admin_email`).maybeSingle();
        return (t ?.value || ``).trim() || null
    } catch {
        return null
    }
}
export {
    t
};