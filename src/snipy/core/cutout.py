import numpy as np
from astropy.coordinates import SkyCoord
from astropy.io import fits
from .image_utils import ensure_mjd_obs, smart_wcs_from_header
from .logger import logger

def filter_files_by_reference_coord(input_files, ra_filter, dec_filter):
    valid_files = [input_files[0]]
    reference_coord = SkyCoord(ra_filter, dec_filter, unit="deg")

    for f in input_files[1:]:
        try:
            hdulist = fits.open(f)
            img_hdu = next(h for h in hdulist if h.data is not None and h.data.ndim == 2)
            header = ensure_mjd_obs(img_hdu.header.copy())
            data = img_hdu.data
            naxis2, naxis1 = data.shape
            wcs = smart_wcs_from_header(header)

            corners_pix = [(0, 0), (naxis1, 0), (0, naxis2), (naxis1, naxis2)]
            corners_world = np.array([wcs.wcs_pix2world(x, y, 0) for x, y in corners_pix])
            ras, decs = corners_world[:, 0], corners_world[:, 1]
            ras_wrapped = np.mod(ras, 360)
            ra_min, ra_max = ras_wrapped.min(), ras_wrapped.max()
            dec_min, dec_max = decs.min(), decs.max()
            ra_ref_wrapped = np.mod(ra_filter, 360)

            if ra_min <= ra_ref_wrapped <= ra_max and dec_min <= dec_filter <= dec_max:
                valid_files.append(f)
            else:
                logger.info(f"Skipping {f}: this file does not contain cutout coordinates.")
        except Exception:
            pass
    return valid_files
