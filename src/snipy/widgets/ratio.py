from anywidget import AnyWidget
from traitlets import Int, Unicode, Float
import pathlib

class Ratio(AnyWidget):
    component = Unicode("Ratio").tag(sync=True)
    _esm = pathlib.Path(__file__).parent.parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent.parent / "static" / "widget.css"
    cropwidth = Float().tag(sync=True)
    cropheight = Float().tag(sync=True)
    naxis_width = Float().tag(sync=True)
    naxis_height = Float().tag(sync=True)
