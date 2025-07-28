import importlib.metadata
import pathlib
import warnings
import traitlets
import logging
from anywidget import AnyWidget
from astrocut import FITSCutout
from astrocut.image_cutout import InputWarning
from astropy.coordinates import SkyCoord
from astropy.wcs import WCS, FITSFixedWarning
from astropy.io import fits
from astropy.io.fits import getheader
from astropy.time import Time
import ipywidgets as widgets
from ipywidgets import Output, GridspecLayout, VBox, HBox
import matplotlib.pyplot as plt
import numpy as np
from traitlets import Unicode, Float, Int, Bool, link
from IPython.display import display, HTML

warnings.simplefilter("ignore", FITSFixedWarning)
warnings.simplefilter("ignore", InputWarning)
warnings.simplefilter("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=Warning, module="astropy.wcs")
warnings.filterwarnings("ignore", category=Warning, module="astrocut")

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__) 


try:
    __version__ = importlib.metadata.version("snipy")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class SnipPyFits(AnyWidget):
    """SnipPy widget
    This widget is that displays astronomical images and allowing you to visualize your cutouts in an interactive way.
    Bundles all sub-widgets in the UI
    """

    _esm = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.js"
    _css = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.css"

    class Coordinates(AnyWidget):
        """Widget responsible for ra and dec"""

        component = Unicode("Coordinates").tag(sync=True)
        _esm = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.js"
        _css = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.css"
        ra = traitlets.Float().tag(sync=True)
        dec = traitlets.Float().tag(sync=True)
        max_ra = traitlets.Float().tag(sync=True)
        min_ra = traitlets.Float().tag(sync=True)
        max_dec = traitlets.Float().tag(sync=True)
        min_dec = traitlets.Float().tag(sync=True)
        ra_step_size = traitlets.Float().tag(sync=True)
        dec_step_size = traitlets.Float().tag(sync=True)

    class Ratio(AnyWidget):
        """Widget responsible for the Zoom and Crop size"""

        component = Unicode("Ratio").tag(sync=True)
        _esm = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.js"
        _css = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.css"
        cropwidth = traitlets.Float().tag(sync=True)
        cropheight = traitlets.Float().tag(sync=True)
        naxis_width = traitlets.Float().tag(sync=True)
        naxis_height = traitlets.Float().tag(sync=True)

    class Normalization(AnyWidget):
        """Widget responsible for Stretch, Min/Max Percent, and Invert"""

        component = Unicode("Normalization").tag(sync=True)
        _esm = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.js"
        _css = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.css"

        min_percent = traitlets.Float(10.0).tag(sync=True)
        max_percent = traitlets.Float(99.0).tag(sync=True)
        invert = traitlets.Bool(False).tag(sync=True)
        stretch = traitlets.Unicode("linear").tag(sync=True)
        colorize = traitlets.Bool(False).tag(sync=True)
        total = traitlets.Int(1).tag(sync=True)
        index = traitlets.Int(0).tag(sync=True)

    class Save(AnyWidget):
        """Widget responsible for the saving features (Memory, FITS, PNG, and Colorized PNG"""

        component = Unicode("Save").tag(sync=True)
        _esm = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.js"
        _css = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.css"
        save_fits = traitlets.Bool(False).tag(sync=True)
        save_png = traitlets.Bool(False).tag(sync=True)
        save_jpg = traitlets.Bool(False).tag(sync=True)
        save_color = traitlets.Bool(False).tag(sync=True)
        total = traitlets.Int(1).tag(sync=True)

    class ImageCounter(AnyWidget):
        """Widget responsible for Flipping between images and inticating which it being viewed"""

        component = Unicode("ImageCounter").tag(sync=True)
        _esm = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.js"
        _css = pathlib.Path(__file__).parent / "static" / "sharedwidget_V1.css"
        index = traitlets.Int(0).tag(sync=True)
        total = traitlets.Int(1).tag(sync=True)
        colorize = traitlets.Bool(False).tag(sync=True)

    def __init__(self, input_files):
        super().__init__()
        self.original_input_files = input_files

        hdulist = fits.open(input_files[0])
        img_hdu = next(h for h in hdulist if h.data is not None and h.data.ndim == 2)

        header = self.ensure_mjd_obs(img_hdu.header.copy())
        data = img_hdu.data
        naxis2, naxis1 = data.shape
        naxis_width = naxis1
        naxis_height = naxis2
        wcs = self.smart_wcs_from_header(header)

        """Initial calculations to get starting coordinates and size"""
        corners_pix = [(0, 0), (naxis1, 0), (0, naxis2), (naxis1, naxis2)]
        corners_world = np.array([wcs.wcs_pix2world(x, y, 0) for x, y in corners_pix])
        ras, decs = corners_world[:, 0], corners_world[:, 1]
        ras_wrapped = np.mod(ras, 360)
        ra_min = float(ras_wrapped.min())
        ra_max = float(ras_wrapped.max())
        dec_min = float(decs.min())
        dec_max = float(decs.max())

        mid_ra = float(ra_max - ((ra_max - ra_min) / 2))
        mid_dec = float(dec_max - ((dec_max - dec_min) / 2))
        self.input_files = self.filter_files_by_reference_coord(input_files, mid_ra, mid_dec)


        ra_step_size = ((ra_max - ra_min)/naxis1)
        dec_step_size = ((dec_max - dec_min)/naxis2)

        self._cutout_images = []
        self._last_params = {}

        """Names widgets as varibles to be recalled through the code"""
        self.Coords = self.Coordinates()
        self.Size = self.Ratio()
        self.Normalize = self.Normalization()
        self.SAVE = self.Save()
        self.Catalog = self.ImageCounter()
        self.ShowImage = Output()

        self.Catalog.total = len(self.input_files)
        self.SAVE.total = len(self.input_files)
        self.Normalize.total = len(self.input_files)

        """Defines the initial values for widget"""
        self.Coords.ra = mid_ra
        self.Coords.dec = mid_dec
        self.Coords.max_ra = ra_max
        self.Coords.max_dec = dec_max
        self.Coords.min_ra = ra_min
        self.Coords.min_dec = dec_min
        self.Size.cropwidth = naxis1
        self.Size.cropheight = naxis2
        self.Size.naxis_width = naxis1
        self.Size.naxis_height = naxis2
        self.Coords.ra_step_size = ra_step_size
        self.Coords.dec_step_size = dec_step_size

        link((self.Normalize, "colorize"), (self.Catalog, "colorize"))
        link((self.Normalize, "index"), (self.Catalog, "index"))

        """Watches for changes in widegt, if change Updates Image"""
        for name in ["ra", "dec"]:
            self.Coords.observe(self.Run_image, names=name)

        for name in ["cropwidth", "cropheight"]:
            self.Size.observe(self.Run_image, names=name)

        for name in ["min_percent", "max_percent", "invert", "stretch"]:
            self.Normalize.observe(self.Run_image, names=name)

        self.Catalog.observe(lambda change: self.Display_image(), names="index")
        self.Normalize.observe(self.Run_image, names="colorize")

        """Watched for button pressed, if pressed will run function"""
        self.SAVE.observe(self.saveFITS, names="save_fits")
        self.SAVE.observe(self.saveImage, names=["save_png", "save_jpg"])

        """Formats the Widgets' Layout"""
        self.Run_image()
        AppLayout = HBox(
            [
                VBox([self.ShowImage, self.Catalog]),
                VBox([self.Coords, self.Size, self.Normalize, self.SAVE]),
            ]
        )
        self.widget = VBox([AppLayout])
        self.widget.add_class("Background")

    def ensure_mjd_obs(self, header):
        """Add MJD-OBS if it is missing but DATE-OBS is present."""
        if "DATE-OBS" in header and "MJD-OBS" not in header:
            try:
                header["MJD-OBS"] = Time(header["DATE-OBS"], format="isot").mjd
            except Exception:
                pass
        return header

    def smart_wcs_from_header(self, header):
        hdr = header.copy()
        has_sip = any(k in hdr for k in ["A_ORDER", "B_ORDER"])
        sip_ok = "-SIP" in hdr.get("CTYPE1", "") or "-SIP" in hdr.get("CTYPE2", "")
        if has_sip:
            if not sip_ok:
                for key in ("CTYPE1", "CTYPE2"):
                    if key in hdr and "-SIP" not in hdr[key]:
                        hdr[key] = hdr[key].strip() + "-SIP"
            wcs = WCS(hdr)
        else:
            sip_keys = [
                k
                for k in hdr
                if k.startswith(("A_", "B_", "AP_", "BP_"))
                or k in ("A_ORDER", "B_ORDER", "A_DMAX", "B_DMAX")
            ]
            for k in sip_keys:
                hdr.remove(k, ignore_missing=True, remove_all=True)
            wcs = WCS(hdr)
        return wcs

    def filter_files_by_reference_coord(self, input_files, ra_filter, dec_filter):
        valid_files = [input_files[0]]
        reference_coord = SkyCoord(ra_filter, dec_filter, unit="deg")
    
        for f in input_files[1:]:
            try:
                hdulist = fits.open(f)
                img_hdu = next(h for h in hdulist if h.data is not None and h.data.ndim == 2)
        
                header = self.ensure_mjd_obs(img_hdu.header.copy())
                data = img_hdu.data
                naxis2, naxis1 = data.shape
                naxis_width = naxis1
                naxis_height = naxis2
                wcs = self.smart_wcs_from_header(header)
        
                """Calculations to get coordinates and size to compare to reference"""
                corners_pix = [(0, 0), (naxis1, 0), (0, naxis2), (naxis1, naxis2)]
                corners_world = np.array([wcs.wcs_pix2world(x, y, 0) for x, y in corners_pix])
                ras, decs = corners_world[:, 0], corners_world[:, 1]
                ras_wrapped = np.mod(ras, 360)
                ra_min = float(ras_wrapped.min())
                ra_max = float(ras_wrapped.max())
                dec_min = float(decs.min())
                dec_max = float(decs.max())
        
                mid_ra = float(ra_max - ((ra_max - ra_min) / 2))
                mid_dec = float(dec_max - ((dec_max - dec_min) / 2))
    
                ra_ref_wrapped = np.mod(ra_filter, 360)
    
                # Check if the reference coordinate falls within this image's bounds
                if ra_min <= ra_ref_wrapped <= ra_max and dec_min <= dec_filter <= dec_max:
                    valid_files.append(f)
                else:
                    logger.info(f"Skipping {f}: coordinates do not match.")
            except Exception:
                pass
        return valid_files


    def Display_image(self):
        """Just show the current image from cached cutouts"""
        with self.ShowImage:
            if self._cutout_images:
                self.ShowImage.clear_output(wait=True)
                fig, ax = plt.subplots(figsize=(5, 5), dpi=100, facecolor="#000f14")
                if not self.Normalize.colorize:
                    index = min(self.Catalog.index, len(self._cutout_images) - 1)
                    fits_img = self._cutout_images[index]
                else:
                    fits_img = self._cutout_images[0]
                ax.imshow(fits_img, cmap="gray", origin="upper")
                ax.set_xticks([])
                ax.set_yticks([])
                for spine in ax.spines.values():
                    spine.set_visible(True)
                    spine.set_color("#ffffff")
                    spine.set_linewidth(1)
                fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
                plt.show()

    def Run_image(self, change=None):
        with self.ShowImage:
            try:
                current_params = {
                    "ra": self.Coords.ra,
                    "dec": self.Coords.dec,
                    "cropwidth": self.Size.cropwidth,
                    "cropheight": self.Size.cropheight,
                    "stretch": self.Normalize.stretch,
                    "invert": self.Normalize.invert,
                    "min_percent": self.Normalize.min_percent,
                    "max_percent": self.Normalize.max_percent,
                    "colorize": self.Normalize.colorize,
                }

                # If parameters haven't changed, just update the display
                if current_params == self._last_params:
                    self.Display_image()
                    return

                self._last_params = current_params

                center_coord = SkyCoord(self.Coords.ra, self.Coords.dec, unit="deg")
                cutout_size = [self.Size.cropwidth, self.Size.cropheight]
                color = self.Normalize.colorize

                # Generate new cutout and process images
                fits_cutout = FITSCutout(
                    input_files=self.input_files,
                    coordinates=center_coord,
                    cutout_size=cutout_size,
                    single_outfile=True,
                )
                cutouts = fits_cutout.get_image_cutouts(
                    stretch=self.Normalize.stretch,
                    invert=self.Normalize.invert,
                    minmax_percent=[self.Normalize.min_percent, self.Normalize.max_percent],
                    colorize=color,
                )

                self.cutout = fits_cutout.fits_cutouts[0]
                self._cutout_images = cutouts
                self.Display_image()

            except Exception as e:
                print(f"Error in Run_image: {e}")

    """Saves the displayed cutouts as  FITS files to parent directory"""

    def saveFITS(self, change):
        try:
            center_coord = SkyCoord(self.Coords.ra, self.Coords.dec, unit="deg")
            cutout_size = [self.Size.cropwidth, self.Size.cropheight]

            fits_cutout = FITSCutout(
                input_files=self.input_files,
                coordinates=center_coord,
                cutout_size=cutout_size,
                single_outfile=False,
            )
            fits_cutout.write_as_fits()
        except:
            pass
        finally:
            self.SAVE.save_fits = False

    """Saves the displayed cutouts as a PNGs to parent directory. If Preview is colorize, will """

    def saveImage(self, change):
        try:
            center_coord = SkyCoord(self.Coords.ra, self.Coords.dec, unit="deg")
            cutout_size = [self.Size.cropwidth, self.Size.cropheight]
            if self.Normalize.colorize == False:
                color = False
                outfile = True
            else:
                color = True
                outfile = False

            if self.SAVE.save_png == True:
                img_format = "png"
            if self.SAVE.save_jpg == True:
                img_format = "jpg"

            fits_cutout = FITSCutout(
                input_files=self.input_files,
                coordinates=center_coord,
                cutout_size=cutout_size,
                single_outfile=outfile,
            )
            fits_cutout.write_as_img(
                stretch=self.Normalize.stretch,
                invert=self.Normalize.invert,
                minmax_percent=[self.Normalize.min_percent, self.Normalize.max_percent],
                colorize=color,
                output_format=img_format,
            )
        except Exception:
            pass
        finally:
            self.SAVE.save_png = False
            self.SAVE.save_jpg = False

    def _ipython_display_(self, **kwargs):
        container = HTML(
            "<style>.Background > .widget-box { background-color: #000f14; padding: 25px; }</style>"
        )
        display(container, self.widget)
