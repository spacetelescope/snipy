from anywidget import AnyWidget
from traitlets import Float, Unicode,Int
import pathlib

class Coordinates(AnyWidget):
    component = Unicode("Coordinates").tag(sync=True)
    _esm = pathlib.Path(__file__).parent.parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent.parent / "static" / "widget.css"
    ra = Float().tag(sync=True)
    dec = Float().tag(sync=True)
    max_ra = Float().tag(sync=True)
    min_ra = Float().tag(sync=True)
    max_dec = Float().tag(sync=True)
    min_dec = Float().tag(sync=True)
    step_size = Float().tag(sync=True)
    ra_step_size = Float().tag(sync=True)
    dec_step_size = Float().tag(sync=True)