from astropy.wcs import WCS
from astropy.time import Time

def ensure_mjd_obs(header):
    if "DATE-OBS" in header and "MJD-OBS" not in header:
        try:
            header["MJD-OBS"] = Time(header["DATE-OBS"], format="isot").mjd
        except Exception:
            pass
    return header

def smart_wcs_from_header(header):
    hdr = header.copy()
    has_sip = any(k in hdr for k in ["A_ORDER", "B_ORDER"])
    sip_ok = "-SIP" in hdr.get("CTYPE1", "") or "-SIP" in hdr.get("CTYPE2", "")
    if has_sip and not sip_ok:
        for key in ("CTYPE1", "CTYPE2"):
            if key in hdr and "-SIP" not in hdr[key]:
                hdr[key] = hdr[key].strip() + "-SIP"
    elif not has_sip:
        sip_keys = [k for k in hdr if k.startswith(("A_", "B_", "AP_", "BP_")) or k in ("A_ORDER", "B_ORDER")]
        for k in sip_keys:
            hdr.remove(k, ignore_missing=True, remove_all=True)
    return WCS(hdr)