from anywidget import AnyWidget
from traitlets import Float, Bool, Unicode, Int
import pathlib

class Normalization(AnyWidget):
    component = Unicode("Normalization").tag(sync=True)
    _esm = pathlib.Path(__file__).parent.parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent.parent / "static" / "widget.css"
    min_percent = Float(10.0).tag(sync=True)
    max_percent = Float(99.0).tag(sync=True)
    invert = Bool(False).tag(sync=True)
    stretch = Unicode('linear').tag(sync=True)
    colorize = Bool(False).tag(sync=True)
    index = Int(1).tag(sync=True)
    total = Int(0).tag(sync=True)
