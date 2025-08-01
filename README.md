# SnipPy

A user friendly interface to interact with Astrocut functions in Jupyter Notebook.
The tools of Astrocut are only a few lines of code away from you!

## Installation
How to start from scratch....
clone git repository

```sh
git clone https://github.com/spacetelescope/snipy.git
cd snipy
```
create environment
```shell
python3 -m venv <ENV NAME>
source <ENV NAME>/bin/activate
```
install SnipPy locally
```shell
pip install .
```
create a kernel for SnipPy and launch Jupyter Lab
```shell
python -m ipykernel install --user --name=SnipPy-venv --display-name "Python (SnipPy)";

jupyter lab
```


you are now ready to load SnipPy in a Jupyter Notebook

```shell
from SnipPy import SnipPyFits
Snip = SnipPyFits([<input_files *Path or URL*>])
Snip
```


## Development

We recommend using [uv](https://github.com/astral-sh/uv) for development.
It will automatically manage virtual environments and dependencies for you.

```sh
git clone https://github.com/spacetelescope/snipy.git
cd snipy

uv run jupyter lab Test_Notebook.ipynb
```

Alternatively, create and manage your own virtual environment:

```sh
git clone https://github.com/spacetelescope/snipy.git
cd snipy
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
jupyter lab Test_Notebook.ipynb
```

Open `Test_Notebook.ipynb` in JupyterLab to start developing. Changes made in `src/snipy/static/` will be reflected
in the notebook.




## Works best in (browser)
Google Chrome




## Works with (Browser)
Apple Safari
Mozilla Firefox

We know that it works, but there is buffering and lag issues in browsers other than Google Chrome


