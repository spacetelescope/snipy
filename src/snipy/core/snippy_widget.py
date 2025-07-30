import pathlib
import warnings
import numpy as np
from astrocut import FITSCutout
from astropy.coordinates import SkyCoord
from astropy.io import fits
from ipywidgets import Output, VBox, HBox
import matplotlib.pyplot as plt
from traitlets import link
from IPython.display import display, HTML
from anywidget import AnyWidget

from .image_utils import ensure_mjd_obs, smart_wcs_from_header
from .cutout import filter_files_by_reference_coord
from .logger import logger
from ..widgets import Coordinates, Ratio, Normalization, Save, ImageCounter


from astrocut.image_cutout import InputWarning
from astropy.wcs import FITSFixedWarning

warnings.simplefilter("ignore", FITSFixedWarning)
warnings.simplefilter("ignore", InputWarning)
warnings.simplefilter("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=Warning, module="astropy.wcs")
warnings.filterwarnings("ignore", category=Warning, module="astrocut")

class SnipPyFits(AnyWidget):
    _esm = pathlib.Path(__file__).parent.parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent.parent / "static" / "widget.css"

    def __init__(self, input_files):
        super().__init__()
        self.original_input_files = input_files

        hdulist = fits.open(input_files[0])
        img_hdu = next(h for h in hdulist if h.data is not None and h.data.ndim == 2)

        header = ensure_mjd_obs(img_hdu.header.copy())
        data = img_hdu.data
        naxis2, naxis1 = data.shape
        naxis_width = naxis1
        naxis_height = naxis2
        wcs = smart_wcs_from_header(header)

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
        self.input_files = filter_files_by_reference_coord(input_files, mid_ra, mid_dec)

        ra_step_size = ((ra_max - ra_min)/naxis1)
        dec_step_size = ((dec_max - dec_min)/naxis2)

        self._cutout_images = []
        self._last_params = {}

        # Initialize widgets
        self.coords = Coordinates()
        self.size = Ratio()
        self.normalize = Normalization()
        self.save = Save()
        self.catalog = ImageCounter()
        self.ShowImage = Output()

        self.catalog.total = len(self.input_files)
        self.save.total = len(self.input_files)
        self.normalize.total = len(self.input_files)

        # Set initial widget values
        self.coords.ra = mid_ra
        self.coords.dec = mid_dec
        self.coords.max_ra = ra_max
        self.coords.max_dec = dec_max
        self.coords.min_ra = ra_min
        self.coords.min_dec = dec_min
        self.size.cropwidth = naxis1
        self.size.cropheight = naxis2
        self.size.naxis_width = naxis1
        self.size.naxis_height = naxis2
        self.coords.ra_step_size = ra_step_size
        self.coords.dec_step_size = dec_step_size

        # Link widgets
        link((self.normalize, "colorize"), (self.catalog, "colorize"))
        link((self.normalize, "index"), (self.catalog, "index"))
        # link((self.normalize, "total"), (self.catalog, "total"))
        # link((self.catalog, "total"), (self.normalize, "total"))
        
        # Observe widget changes to trigger image updates
        for name in ["ra", "dec"]:
            self.coords.observe(self.Run_Image, names=name)

        for name in ["cropwidth", "cropheight"]:
            self.size.observe(self.Run_Image, names=name)

        for name in ["min_percent", "max_percent", "invert", "stretch"]:
            self.normalize.observe(self.Run_Image, names=name)

        self.catalog.observe(lambda change: self.Display_Image(), names="index")
        self.normalize.observe(self.Run_Image, names="colorize")

        # Save button observers
        self.save.observe(self.Save_FITS, names="save_fits")
        self.save.observe(self.Save_Image, names=["save_png", "save_jpg"])

        self.Run_Image()

        AppLayout = HBox([
            VBox([self.ShowImage, self.catalog]),
            VBox([self.coords, self.size, self.normalize, self.save]),
        ])
        self.widget = VBox([AppLayout])
        self.widget.add_class("Background")

    def Display_Image(self):
        with self.ShowImage:
            if self._cutout_images:
                self.ShowImage.clear_output(wait=True)
                fig, ax = plt.subplots(figsize=(5, 5), dpi=100, facecolor="#000f14")
                if not self.normalize.colorize:
                    index = min(self.catalog.index, len(self._cutout_images) - 1)
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
                plt.tight_layout()
                plt.show()

    def Run_Image(self, change=None):
        with self.ShowImage:
            try:
                current_params = {
                    "ra": self.coords.ra,
                    "dec": self.coords.dec,
                    "cropwidth": self.size.cropwidth,
                    "cropheight": self.size.cropheight,
                    "stretch": self.normalize.stretch,
                    "invert": self.normalize.invert,
                    "min_percent": self.normalize.min_percent,
                    "max_percent": self.normalize.max_percent,
                    "colorize": self.normalize.colorize,
                }
    
                if current_params == self._last_params:
                    self.Display_Image()
                    return
    
                self._last_params = current_params
    
                center_coord = SkyCoord(self.coords.ra, self.coords.dec, unit="deg")
                cutout_size = [self.size.cropwidth, self.size.cropheight]
                color = self.normalize.colorize
    
                fits_cutout = FITSCutout(
                    input_files=self.input_files,
                    coordinates=center_coord,
                    cutout_size=cutout_size,
                    single_outfile=True,
                )
    
                cutouts = fits_cutout.get_image_cutouts(
                    stretch=self.normalize.stretch,
                    invert=self.normalize.invert,
                    minmax_percent=[self.normalize.min_percent, self.normalize.max_percent],
                    colorize=color,
                )
                
                self._cutout_images = cutouts
                self.catalog.index = 0
                self.cutout = fits_cutout.fits_cutouts[0]
                self.catalog.total  = len(cutouts)
                self.Display_Image()

            except Exception as e:
                print(f"Error in Run_Image: {e}")


    def Save_FITS(self, change):
        try:
            center_coord = SkyCoord(self.coords.ra, self.coords.dec, unit="deg")
            cutout_size = [self.size.cropwidth, self.size.cropheight]

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
            self.save.save_fits = False

    def Save_Image(self, change):
        try:
            center_coord = SkyCoord(self.coords.ra, self.coords.dec, unit="deg")
            cutout_size = [self.size.cropwidth, self.size.cropheight]
            if self.normalize.colorize == False:
                color = False
                outfile = True
            else:
                color = True
                outfile = False

            if self.save.save_png == True:
                img_format = "png"
            if self.save.save_jpg == True:
                img_format = "jpg"

            fits_cutout = FITSCutout(
                input_files=self.input_files,
                coordinates=center_coord,
                cutout_size=cutout_size,
                single_outfile=outfile,
            )
            fits_cutout.write_as_img(
                stretch=self.normalize.stretch,
                invert=self.normalize.invert,
                minmax_percent=[self.normalize.min_percent, self.normalize.max_percent],
                colorize=color,
                output_format=img_format,
            )
        except Exception:
            pass
        finally:
            self.save.save_png = False
            self.save.save_jpg = False


    def _ipython_display_(self, **kwargs):
        container = HTML(
            "<style>.Background > .widget-box { background-color: #000f14; padding: 25px; }</style>"
        )
        display(container, self.widget)
