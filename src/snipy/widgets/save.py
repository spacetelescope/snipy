from anywidget import AnyWidget
from traitlets import Bool, Int, Unicode
import pathlib

class Save(AnyWidget):
    component = Unicode("Save").tag(sync=True)
    _esm = pathlib.Path(__file__).parent.parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent.parent / "static" / "widget.css"
    save_fits = Bool(False).tag(sync=True)
    save_png = Bool(False).tag(sync=True)
    save_jpg = Bool(False).tag(sync=True)
    total = Int().tag(sync=True)
