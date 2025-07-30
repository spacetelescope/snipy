from anywidget import AnyWidget
from traitlets import Int, Bool, Unicode
import pathlib

class ImageCounter(AnyWidget):
    component = Unicode("ImageCounter").tag(sync=True)
    _esm = pathlib.Path(__file__).parent.parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent.parent / "static" / "widget.css"
    index = Int(0).tag(sync=True)
    total = Int(1).tag(sync=True)
    colorize = Bool(False).tag(sync=True)
