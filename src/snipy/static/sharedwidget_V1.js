(function injectExternalStyles() {
  const stylesheets = [
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
    "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css"
  ];

  stylesheets.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  });
})();


export function render({ model, el }) {
	let componentType = model.get("component");

	switch (componentType) {
		case "Coordinates":
			renderCoordinates({ model, el });
			break;
        case "Ratio":
			renderRatio({ model, el });
			break;
        case "Normalization":
			renderNormalization({ model, el });
			break;
		case "Save":
			renderSave({ model, el });
			break;
		case "ImageCounter":
			renderImageCounter({ model, el });
			break;            
		default:
			throw new Error(`Unknown component type ${componentType}`);
	}
}












function renderCoordinates({ model, el }) {
//groups all groups together
      const container = document.createElement("div");
      const CoordGroup = document.createElement("div");
     CoordGroup.style.display = "flex";
     CoordGroup.style.gap = "1rem";
     CoordGroup.style.marginLeft = "1rem";
     CoordGroup.style.marginBottom = "10%";
     container.classList.add("control-widget");
     container.style.position = "relative";
     
    // === RA ===
      const raGroup = document.createElement("div");
      const raLabel = document.createElement("label");
      raLabel.innerText = "RA:";
      raLabel.title = "right ascension (degrees)";
      raLabel.style.marginRight = "1rem";
      const raInput = document.createElement("input");
      raInput.title = "right ascension (degrees)";
      raInput.type = "number";
      raInput.step = "0.0001";
      raInput.value = model.get("ra").toFixed(5);
      raInput.style.width = "8rem";
      raGroup.style.marginTop = "1rem";
      raInput.addEventListener("input", () => {
        model.set("ra", parseFloat(raInput.value));
        model.save_changes();
      });
      model.on("change:ra", () => {
        raInput.value = model.get("ra").toFixed(5);
      });
      raGroup.appendChild(raLabel);
      raGroup.appendChild(raInput);

      // === DEC ===
      const decGroup = document.createElement("dec");
      const decLabel = document.createElement("label");
      decLabel.innerText = "DEC:";
      decLabel.title = "declination (degrees)";
      decLabel.style.marginRight = "1rem";
      const decInput = document.createElement("input");
      decInput.type = "number";
      decInput.step = "0.00001";
      decInput.value = model.get("dec").toFixed(5);
      decInput.style.width = "8rem";
      decGroup.style.marginTop = "1rem";
      decInput.addEventListener("input", () => {
        model.set("dec", parseFloat(decInput.value));
        model.save_changes();
      });
      model.on("change:dec", () => {
        decInput.value = model.get("dec").toFixed(5);
      });
      decGroup.appendChild(decLabel);
      decGroup.appendChild(decInput);

      CoordGroup.appendChild(raGroup);
      CoordGroup.appendChild(decGroup);

      container.appendChild(CoordGroup);
      el.appendChild(container);
    }












function renderRatio({ model, el }) {
	//groups all groups together

      const container = document.createElement("div");
      const RatioGroup = document.createElement("div");
      RatioGroup.style.display = "flex";
      RatioGroup.style.gap = "1rem";
      RatioGroup.style.marginLeft = "1rem";
      RatioGroup.style.marginBottom = "9%";
      RatioGroup.style.alignItems = "center";
      container.classList.add("control-widget");
      container.style.position = "relative";

      // === Crop Size Width ===

      const cropwidthGroup = document.createElement("div");
      const cropwidthLabel = document.createElement("label");
      cropwidthLabel.innerHTML = "Crop Width:";
      cropwidthLabel.title = "image width (pixels)";
      const cropwidthInput = document.createElement("input");
      cropwidthInput.type = "number";
      cropwidthInput.step = "any";
      cropwidthInput.value = model.get("cropwidth");
      cropwidthInput.style.width = "5rem";
      cropwidthLabel.style.marginRight = "1rem";
      cropwidthInput.addEventListener("input", () => {
        model.set("cropwidth", parseInt(cropwidthInput.value));
        model.save_changes();
      });
      model.on("change:cropwidth", () => {
        cropwidthInput.value = model.get("cropwidth");
      });
      cropwidthGroup.appendChild(cropwidthLabel);
      cropwidthGroup.appendChild(cropwidthInput);


    
      // === Crop Size Height ===

      const cropheightGroup = document.createElement("div");
      const cropheightLabel = document.createElement("label");
      cropheightLabel.innerHTML = "Crop Height:";
      cropheightLabel.title = "image height (pixels)";
      const cropheightInput = document.createElement("input");
      cropheightInput.type = "number";
      cropheightInput.step = "any";
      cropheightInput.value = model.get("cropheight");
      cropheightInput.style.width = "5rem";
      cropheightLabel.style.marginRight = "1rem";
      cropheightInput.addEventListener("input", () => {
        model.set("cropheight", parseInt(cropheightInput.value));
        model.save_changes();
      });
      model.on("change:cropheight", () => {
        cropheightInput.value = model.get("cropheight");
      });
      cropheightGroup.appendChild(cropheightLabel);
      cropheightGroup.appendChild(cropheightInput);

        // === Zoom In Button ===

    const zoominGroup = document.createElement("div");
    const zoominButton = document.createElement("button");
    zoominButton.innerHTML = '<span class="mdi mdi-magnify-plus-outline mdi-48px"></span>';
    zoominButton.title = "decreases the crop size by 0.5";
    zoominButton.style.width = "50px";
    zoominButton.style.height = "50px";
    zoominButton.addEventListener("click", () => {
        //When pressed will multiply the crop sizes by 0.5 and input that answer as new crop sizes
      const newWidth = model.get("cropwidth") * 0.5;
      const newHeight = model.get("cropheight") * 0.5;
        //Saves as an integer
      model.set("cropwidth", Math.round(newWidth));
      model.set("cropheight", Math.round(newHeight));
      model.save_changes();
    });
    zoominGroup.appendChild(zoominButton);
    
        // === Zoom Out Button ===

    const zoomoutGroup = document.createElement("div");
    const zoomoutButton = document.createElement("button");
    zoomoutButton.innerHTML = '<span class="mdi mdi-magnify-minus-outline mdi-48px"></span>';
    zoomoutButton.title = "increases the crop size by 1.5";
    zoomoutButton.style.width = "50px";
    zoomoutButton.style.height = "50px";
    zoomoutButton.addEventListener("click", () => {
      const newWidth = model.get("cropwidth") * 1.5;
      const newHeight = model.get("cropheight") * 1.5;
      model.set("cropwidth", Math.round(newWidth));
      model.set("cropheight", Math.round(newHeight));
      model.save_changes();
    });
    zoomoutGroup.appendChild(zoomoutButton);


    RatioGroup.appendChild(zoominGroup);
    RatioGroup.appendChild(zoomoutGroup);
    RatioGroup.appendChild(cropwidthGroup);
    RatioGroup.appendChild(cropheightGroup);

    

          // === Append All Groups ===
//Stacked one on top of the other
    
      container.appendChild(RatioGroup);
      el.appendChild(container);
    }

function renderNormalization({ model, el }) {
//groups all groups together
      const container = document.createElement("div");
      container.classList.add("control-widget");
      container.style.position = "relative";
      const NormalGroup = document.createElement("div");
      NormalGroup.style.marginBottom = "9%";
    
    
      // === Min% ===

      const minGroup = document.createElement("div");
      minGroup.style.width = "601px";
      minGroup.style.marginBottom = "2%"
      const minLabel = document.createElement("label");
      minLabel.innerText = "Min %:";
      minLabel.style.marginLeft = "1rem";
      minLabel.style.marginRight = "1rem";
      minLabel.title = "adjust the upper limit of the image normalization where pixel values outside this range are clipped";
    //Creates Slider
      const minSlider = document.createElement("input");
      minSlider.class = "slider";
      minSlider.type = "range";
      minSlider.min = "0";
      minSlider.max = "100";
      minSlider.step = "0.1";
      minSlider.value = model.get("min_percent");
    //Creates number Input
      const minValue = document.createElement("input");
      minValue.type = "number";
      minValue.min = "0";
      minValue.max = "100";
      minValue.step = "0.1";
      minValue.value = model.get("min_percent").toFixed(1);
    
      minSlider.addEventListener("input", () => {
        const val = parseFloat(minSlider.value);
        model.set("min_percent", val);
        model.save_changes();
      });

      minValue.addEventListener("input", () => {
        const val = parseFloat(minValue.value);
        if (!isNaN(val)) {
          model.set("min_percent", val);
          model.save_changes();
        }
      });
      model.on("change:min_percent", () => {
        const val = model.get("min_percent");
        minSlider.value = val;
        minValue.value = val.toFixed(1);
      });

    
      minGroup.appendChild(minLabel);
      minGroup.appendChild(minSlider);
      minGroup.appendChild(minValue);

    
      // === Max% ===

      const maxGroup = document.createElement("div");
      maxGroup.style.width = "602px";
      maxGroup.style.marginBottom = "2%"
      const maxLabel = document.createElement("label");
      maxLabel.innerText = "Max %:";
      maxLabel.style.marginLeft = "1rem";
      maxLabel.style.marginRight = "0.8rem";
      maxLabel.title = "adjust the upper limit of the image normalization where pixel values outside this range are clipped";
      const maxSlider = document.createElement("input");
      maxSlider.class = "slider";
      maxSlider.type = "range";
      maxSlider.min = "0";
      maxSlider.max = "100";
      maxSlider.step = "0.1";
      maxSlider.value = model.get("max_percent");
      const maxValue = document.createElement("input");
      maxValue.type = "number";
      maxValue.min = "0";
      maxValue.max = "100";
      maxValue.step = "0.1";
      maxValue.value = model.get("max_percent").toFixed(1);
      maxSlider.addEventListener("input", () => {
        const val = parseFloat(maxSlider.value);
        model.set("max_percent", val);
        model.save_changes();
      });
      maxValue.addEventListener("input", () => {
        const val = parseFloat(maxValue.value);
        if (!isNaN(val)) {
          model.set("max_percent", val);
          model.save_changes();
        }
      });
      model.on("change:max_percent", () => {
        const val = model.get("max_percent");
        maxSlider.value = val;
        maxValue.value = val.toFixed(1);
      });
      maxGroup.appendChild(maxLabel);
      maxGroup.appendChild(maxSlider);
      maxGroup.appendChild(maxValue);



    
    const invertButtonGroup = document.createElement("div");
    invertButtonGroup.style.display = "flex";
    invertButtonGroup.style.alignItems = "center";
    const invertButton = document.createElement("button");
    invertButton.innerText = "Invert";
    invertButton.title = "invert image";
    invertButton.style.marginLeft = "1rem";
    invertButton.style.width = "100px";
    invertButton.style.height = "40px";
    let invert = false
    
    // On click: trigger save
    invertButton.addEventListener("click", () => {
      invert = !invert;
      model.set("invertbut", invert);
      model.save_changes();
    });
    invertButtonGroup.appendChild(invertButton);

    const ColorButtonGroup = document.createElement("div");
    ColorButtonGroup.style.display = "flex";
    ColorButtonGroup.style.alignItems = "center";
    
    const ColorButton = document.createElement("button");
    ColorButton.innerText = "Preview Color";
    ColorButton.title = "colorize image";
    ColorButton.style.marginLeft = "1rem";
    ColorButton.style.width = "100px";
    ColorButton.style.height = "40px";
    
    let color = false;
    ColorButton.addEventListener("click", () => {
      color = !color;
      model.set("preview_color", color);
      model.save_changes();
    });
    
    ColorButtonGroup.appendChild(ColorButton);
    invertButtonGroup.appendChild(ColorButtonGroup);
    
    // Function to show/hide based on index
    function updateColorButton() {
      const shouldShow = model.get("total") >= 3 && model.get("index") == 0;
      ColorButtonGroup.style.display = shouldShow ? "flex" : "none";
    }
    
    // Initial render and reactive update
    updateColorButton();
    model.on("change:index", updateColorButton);








    // === Custom Stretch Dropdown (button + dropdown) ===
    const stretchGroup = document.createElement("div");
    stretchGroup.style.display = "flex";
    stretchGroup.style.alignItems = "center";
    stretchGroup.style.marginBottom = "2%"

    
    const stretchLabel = document.createElement("label");
    stretchLabel.innerText = "Stretch:";
    stretchLabel.title = "applies stretch function to image";   
    stretchLabel.style.marginLeft = "1rem";
    stretchLabel.style.marginRight = "0.6rem";
    stretchGroup.appendChild(stretchLabel);
    
    const stretchDropdownWrapper = document.createElement("div");
    stretchDropdownWrapper.style.display = "inline-block";
    stretchDropdownWrapper.style.position = "relative";
    
    const stretchButton = document.createElement("button");
    stretchButton.style.width = "100px";
    stretchButton.style.height = "40px";
    stretchButton.title = "Choose stretch function";
    
    const stretchOptions = ["linear", "log", "sqrt", "asinh", "sinh"];
    
    let currentStretch = model.get("stretch") || "linear";
    stretchButton.innerText = currentStretch + "    ⏷";
    
    const stretchDropdownMenu = document.createElement("div");
    stretchDropdownMenu.style.position = "absolute";
    stretchDropdownMenu.style.top = "100%";
    stretchDropdownMenu.style.left = "0";
    stretchDropdownMenu.style.width = "98%";
    stretchDropdownMenu.style.background = "#01617e";
    stretchDropdownMenu.style.border = "1px solid #ffffff";
    stretchDropdownMenu.style.display = "none";
    stretchDropdownMenu.style.zIndex = "999";
    
    stretchOptions.forEach(option => {
      const item = document.createElement("div");
      item.innerText = option;
      item.style.color = "#ffffff";
      item.style.fontWeight = "normal";
      item.style.padding = "8px 12px";
      item.style.cursor = "pointer";

      item.addEventListener("click", () => {
        currentStretch = option;
        stretchButton.innerText = currentStretch + "    ⏷";
        stretchDropdownMenu.style.display = "none";
    
        model.set("stretch", currentStretch);
        model.save_changes();
      });
    
      item.addEventListener("mouseover", () => item.style.background = "#a75000");
      item.addEventListener("mouseout", () => item.style.background = "#01617e");
    
      stretchDropdownMenu.appendChild(item);
    });
    
    stretchButton.addEventListener("click", () => {
      stretchDropdownMenu.style.display = (stretchDropdownMenu.style.display === "none") ? "block" : "none";
    });
    
    // Close dropdown if click outside
    document.addEventListener("click", (e) => {
      if (!stretchDropdownWrapper.contains(e.target)) {
        stretchDropdownMenu.style.display = "none";
      }
    });
    
    stretchDropdownWrapper.appendChild(stretchButton);
    stretchDropdownWrapper.appendChild(stretchDropdownMenu);
    stretchGroup.appendChild(stretchDropdownWrapper);
    
    container.appendChild(stretchGroup);
    
    // Update button if model changes externally
    model.on("change:stretch", () => {
      currentStretch = model.get("stretch");
      stretchButton.innerText = currentStretch + "  ⏷";
    });


      // === Append All Groups ===
//Stacked one on top of the other
    
      NormalGroup.appendChild(stretchGroup);
      NormalGroup.appendChild(minGroup);
      NormalGroup.appendChild(maxGroup);
      NormalGroup.appendChild(invertButtonGroup);

      container.appendChild(NormalGroup);
      el.appendChild(container);
    }





function renderSave({ model, el }) {
  const container = document.createElement("div");
  container.classList.add("control-widget");
  container.style.position = "relative"; // to anchor dropdown

  const SaveGroup = document.createElement("div");
  SaveGroup.style.marginBottom = "15%";
    
  // === Save Dropdown Button ===
  const dropdownWrapper = document.createElement("div");
  dropdownWrapper.style.display = "inline-block";
  dropdownWrapper.style.position = "relative";

  const saveButton = document.createElement("button");
  saveButton.innerText = "Save ⏷";
  saveButton.title = "Choose format to save";
  saveButton.style.width = "725%";
  saveButton.style.height = "40px";
    
  saveButton.style.marginLeft = "1rem";

  const dropdownMenu = document.createElement("div");
  dropdownMenu.style.position = "absolute";
  dropdownMenu.style.top = "100%";
  dropdownMenu.style.left = "0";
  dropdownMenu.style.width = "723%";
  dropdownMenu.style.marginLeft = "1rem";
  dropdownMenu.style.background = "#01617e";
  dropdownMenu.style.border = "1px solid #ffffff";
  dropdownMenu.style.display = "none";
  dropdownMenu.style.zIndex = "999";

  const options = [
    { label: "PNG", action: () => model.set("save_png", true) },
    { label: "FITS", action: () => model.set("save_fits", true) },
  ];

  options.forEach(({ label, action }) => {
    const item = document.createElement("div");
    item.innerText = label;
    item.style.color = "#ffffff";
    item.style.fontWeight = "normal";
    item.style.padding = "8px 12px";
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
      action();
      model.save_changes();
    });
    item.addEventListener("mouseover", () => item.style.background = "#a75000");
    item.addEventListener("mouseout", () => item.style.background = "#01617e");
    dropdownMenu.appendChild(item);
  });

  saveButton.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  dropdownWrapper.appendChild(saveButton);
  dropdownWrapper.appendChild(dropdownMenu);


  SaveGroup.appendChild(dropdownWrapper);


  container.appendChild(SaveGroup);
  el.appendChild(container);
}





function renderImageCounter({ model, el }) {
  const container = document.createElement("div");
  container.classList.add("control-widget");
  container.style.position = "relative";

  const IndexGroup = document.createElement("div");
  IndexGroup.style.display = "flex";
  IndexGroup.style.alignItems = "center";
  IndexGroup.style.gap = "0.5rem";
  IndexGroup.style.marginRight = "0.5rem";
  IndexGroup.style.marginBottom = "0.5rem";
  IndexGroup.style.justifyContent = "right";

  const decrementButton = document.createElement("button");
  decrementButton.innerHTML = '<span class="mdi mdi-menu-left mdi-24px"></span>';
  decrementButton.title = "Previous image";
  decrementButton.style.background = "none";
  decrementButton.style.width = "1rem";
  decrementButton.style.height = "1rem";
  decrementButton.style.display = "flex";
  decrementButton.style.alignItems = "center";
  decrementButton.style.justifyContent = "center";

  const incrementButton = document.createElement("button");
  incrementButton.innerHTML = '<span class="mdi mdi-menu-right mdi-24px"></span>';
  incrementButton.title = "Next image";
  incrementButton.style.background = "none";
  incrementButton.style.width = "1rem";
  incrementButton.style.height = "1rem";
  incrementButton.style.display = "flex";
  incrementButton.style.alignItems = "center";
  incrementButton.style.justifyContent = "center";

  const label = document.createElement("span");
  label.style.marginLeft = "0.5rem";

  const Color_Label = document.createElement("label");
  Color_Label.innerHTML = "Colorized Image";

  const updateLabel = () => {
    const index = model.get("index") + 1;
    const total = model.get("total") || "?";
    label.textContent = `Image ${index}/${total}`;
  };

  const updateCounterDisplay = () => {
    IndexGroup.innerHTML = "";
    if (model.get("preview_color") === true) {
      IndexGroup.appendChild(Color_Label);
    } else {
      IndexGroup.appendChild(decrementButton);
      IndexGroup.appendChild(label);
      IndexGroup.appendChild(incrementButton);
      updateLabel();
    }
  };

  model.on("change:index", updateLabel);
  model.on("change:preview_color", updateCounterDisplay);

  // Input buttons
  decrementButton.addEventListener("click", () => {
    const current = model.get("index");
    if (current > 0) {
      model.set("index", current - 1);
      model.save_changes();
    }
  });

  incrementButton.addEventListener("click", () => {
    const current = model.get("index");
    const total = model.get("total");
    if (current < total - 1) {
      model.set("index", current + 1);
      model.save_changes();
    }
  });

  updateCounterDisplay();
  container.appendChild(IndexGroup);
  el.appendChild(container);
}
