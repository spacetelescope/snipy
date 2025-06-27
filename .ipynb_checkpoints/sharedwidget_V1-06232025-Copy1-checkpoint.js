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
    // const CoordGroup = document.createElement("div");
     CoordGroup.style.display = "flex";
     CoordGroup.style.gap = "1rem";
      container.classList.add("control-widget");
      container.style.position = "relative";
     
    // === RA ===
      const raGroup = document.createElement("div");
      const raLabel = document.createElement("label");
      raLabel.innerText = "RA:";
      raLabel.title = "right ascension (degrees)";
      const raInput = document.createElement("input");
      raInput.title = "right ascension (degrees)";
      raInput.type = "number";
      raInput.step = "0.0001";
      raInput.value = model.get("ra").toFixed(5);
      raInput.style.width = "8rem";
      raGroup.style.marginTop = "1rem";
      // raLabel.style.marginLeft = ".5rem";
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
      const decInput = document.createElement("input");
      decInput.type = "number";
      decInput.step = "0.00001";
      decInput.value = model.get("dec").toFixed(5);
      decInput.style.width = "8rem";
      decGroup.style.marginTop = "1rem";
      // decLabel.style.marginLeft = ".5rem";
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
      // toptopGroup.style.marginRight = ".5rem";

      container.appendChild(CoordGroup);
      el.appendChild(container);
    }












function renderRatio({ model, el }) {
	//groups all groups together

      const container = document.createElement("div");
      const RatioGroup = document.createElement("div");
      RatioGroup.style.display = "flex";
      RatioGroup.style.gap = "1rem";
      container.classList.add("control-widget");
      container.style.position = "relative";

          // // === Crop Size Width ===
    
      const cropwidthGroup = document.createElement("div");
      const cropwidthLabel = document.createElement("label");
      cropwidthLabel.innerText = "Crop Width:";
      cropwidthLabel.title = "image width (pixels)";
      
      const cropwidthInput = document.createElement("input");
      cropwidthInput.type = "number";
      cropwidthInput.step = "any";
      cropwidthInput.value = model.get("cropwidth");
      // cropwidthInput.style.width = "5rem";
      // cropwidthGroup.style.marginTop = "1rem";
      // cropwidthGroup.style.marginLeft = ".5rem";
      // cropwidthGroup.style.marginRight = "3rem";
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
      cropheightLabel.innerText = "Crop Height:";
      cropheightLabel.title = "image height (pixels)";
      const cropheightInput = document.createElement("input");
      cropheightInput.type = "number";
      cropheightInput.step = "any";
      cropheightInput.value = model.get("cropheight");
      // cropheightInput.style.width = "5rem";
      // cropheightGroup.style.marginTop = "1rem";
      // cropheightLabel.style.marginLeft = ".5rem";
      // cropheightLabel.style.marginBottom = ".5rem";
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
    zoominButton.innerHTML = '<span class="mdi mdi-magnify-plus-outline mdi-36px"></span>';
    zoominButton.title = "decreases the crop size by 0.5";
    // zoominButton.style.marginTop = "1rem";
    // zoominButton.style.marginRight = ".5rem";
    // zoominButton.style.marginLEFT = ".5rem";
    zoominButton.style.width = "36px";
    zoominButton.style.height = "36px";
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
    // zoomoutButton.innerText = "🔍➖";
    zoomoutButton.innerHTML = '<span class="mdi mdi-magnify-minus-outline mdi-36px"></span>';
    // zoomoutButton.innerHTML = "🔍➖";
    zoomoutButton.title = "increases the crop size by 1.5";
    // zoomoutButton.style.marginTop = ".2rem";
    // zoomoutButton.style.marginRight = ".5rem";
    // zoomoutButton.style.marginLeft = ".5rem";
    // zoomoutButton.style.marginBottom = "1rem";
    zoomoutButton.style.width = "36px";
    zoomoutButton.style.height = "36px";
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
      // === Min% ===

      const minGroup = document.createElement("div");
      // minGroup.style.display = "flex";
      minGroup.style.width = "100%";

      const minLabel = document.createElement("label");
      minLabel.innerText = "Min %:";
      minLabel.title = "adjust the upper limit of the image normalization where pixel values outside this range are clipped";
      // minGroup.style.marginRight = ".5rem";
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
      const maxLabel = document.createElement("label");
      maxLabel.innerText = "Max %:";
      maxLabel.title = "adjust the upper limit of the image normalization where pixel values outside this range are clipped";
      // maxLabel.style.marginLeft = ".5rem";
      // maxGroup.style.marginRight = ".5rem";
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
    const invertButton = document.createElement("button");
    invertButton.innerText = "INVERT";
    invertButton.title = "invert image";
    // saveFITSButton.style.marginTop = "0.2rem";
    // saveFITSButton.style.marginRight = ".5rem";
    // saveFITSButton.style.marginLeft = ".5rem";
    // saveFITSButton.style.width = "7rem";
    let invert = false
    
    // On click: trigger save
    invertButton.addEventListener("click", () => {
      invert = !invert;
      model.set("invertbut", invert);
      model.save_changes();
    });
    invertButtonGroup.appendChild(invertButton);






    // === Custom Stretch Dropdown (button + dropdown) ===
    const stretchGroup = document.createElement("div");
    
    const stretchLabel = document.createElement("label");
    stretchLabel.innerText = "Stretch:";
    stretchLabel.title = "applies stretch function to image";
    stretchGroup.appendChild(stretchLabel);
    
    const stretchDropdownWrapper = document.createElement("div");
    stretchDropdownWrapper.style.display = "inline-block";
    stretchDropdownWrapper.style.position = "relative";
    stretchDropdownWrapper.style.marginLeft = "0.5rem";
    
    const stretchButton = document.createElement("button");
    stretchButton.style.width = "65px";
    stretchButton.style.height = "30px";
    stretchButton.style.background = "#01617e";
    stretchButton.style.color = "#ffffff";
    // stretchButton.style.border = "1px solid #ffffff";
    stretchButton.style.cursor = "pointer";
    stretchButton.style.fontWeight = "normal";
    stretchButton.style.textAlign = "left";
    // stretchButton.style.padding = "0 10px";
    stretchButton.title = "Choose stretch function";
    
    const stretchOptions = ["linear", "log", "sqrt", "asinh", "sinh"];
    
    let currentStretch = model.get("stretch") || "linear";
    stretchButton.innerText = currentStretch + " ⏷";
    
    const stretchDropdownMenu = document.createElement("div");
    stretchDropdownMenu.style.position = "absolute";
    stretchDropdownMenu.style.top = "100%";
    stretchDropdownMenu.style.left = "0";
    stretchDropdownMenu.style.width = "63px";
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
        stretchButton.innerText = currentStretch + " ⏷";
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
      stretchButton.innerText = currentStretch + " ⏷";
    });








    

    
    
      // // === Stretch Dropdown ===

      // const stretchGroup = document.createElement("div");
      // const stretchLabel = document.createElement("label");
      // stretchLabel.innerText = "Stretch:";
      // stretchLabel.title = "applies stretch function to ";
      // // stretchLabel.style.marginLeft = ".5rem";
      // // stretchGroup.style.marginTop = "1.5rem";
      // const stretchSelect = document.createElement("select");
      // ["linear", "log", "sqrt", "asinh", "sinh"].forEach(option => {
      //   const opt = document.createElement("option");
      //   opt.value = option;
      //   opt.innerText = option;
      //   stretchSelect.appendChild(opt);
      // });

      // stretchSelect.value = model.get("stretch");
      // stretchSelect.addEventListener("change", () => {
      //   model.set("stretch", stretchSelect.value);
      //   model.save_changes();
      // });
      // model.on("change:stretch", () => {
      //   stretchSelect.value = model.get("stretch");
      // });
      // stretchGroup.appendChild(stretchLabel);
      // stretchGroup.appendChild(stretchSelect);

      // === Append All Groups ===
//Stacked one on top of the other
    
      container.appendChild(stretchGroup);
      container.appendChild(minGroup);
      container.appendChild(maxGroup);
      // container.appendChild(invertGroup);
      container.appendChild(invertButtonGroup);
      el.appendChild(container);
    }




function renderSave({ model, el }) {
  const container = document.createElement("div");
  container.classList.add("control-widget");
  container.style.position = "relative"; // to anchor dropdown


  // Optional: Save to memory button
  const saveMemoryButtonGroup = document.createElement("div");
  const saveMemoryButton = document.createElement("button");
  saveMemoryButton.innerText = "Save to Notebook";
  saveMemoryButton.title = "Save all cropped images to memory as 'cutout'";
  saveMemoryButton.style.width = "75%";
  saveMemoryButton.style.height = "30px";
  saveMemoryButton.style.background = "#a75000";

  saveMemoryButton.addEventListener("click", () => {
    model.set("save_memory", true);
    model.save_changes();
  });

  saveMemoryButtonGroup.appendChild(saveMemoryButton);
  container.appendChild(saveMemoryButtonGroup);



    
  // === Save Dropdown Button ===
  const dropdownWrapper = document.createElement("div");
  dropdownWrapper.style.display = "inline-block";
  dropdownWrapper.style.position = "relative";

  const saveButton = document.createElement("button");
  saveButton.innerText = "Save ⏷";
  saveButton.title = "Choose format to save";
  saveButton.style.width = "25%";
  saveButton.style.height = "30px";

  const dropdownMenu = document.createElement("div");
  dropdownMenu.style.position = "absolute";
  dropdownMenu.style.top = "100%";
  dropdownMenu.style.left = "0";
  dropdownMenu.style.width = "24.5%";
  dropdownMenu.style.background = "#01617e";
  dropdownMenu.style.border = "1px solid #ffffff";
  // dropdownMenu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  dropdownMenu.style.display = "none";
  dropdownMenu.style.zIndex = "999";

  const options = [
    { label: "PNGs", action: () => model.set("save_png", true) },
    { label: "FITS", action: () => model.set("save_fits", true) }
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

  // Optional: close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  dropdownWrapper.appendChild(saveButton);
  dropdownWrapper.appendChild(dropdownMenu);
  container.appendChild(dropdownWrapper);



  el.appendChild(container);
}












function renderImageCounter({ model, el }) {
//groups all groups together
      const container = document.createElement("div");
      container.classList.add("control-widget");
      container.style.position = "relative";
    
  // // === FITS Index Selection ===

//     const IndexGroup = document.createElement("div");
//     const IndexLabel = document.createElement("label");
//     IndexLabel.innerText = "Image:";
//     IndexLabel.title = "FITS selection based on input (starts at 0)";
//     IndexGroup.style.marginRight = "1rem";
//     IndexGroup.style.marginLeft = ".5rem";
//     IndexGroup.style.marginTop = ".5rem";
//     IndexGroup.style.marginBottom = ".5rem";
//     const IndexInput = document.createElement("input");
//     IndexInput.type = "number";
//     IndexInput.step = "1";
//     IndexInput.min = "0"
//     IndexInput.value = model.get("index");
//     IndexInput.style.width = "2rem";
//     IndexInput.addEventListener("input", () => {
//         model.set("index", parseInt(IndexInput.value));
//         model.save_changes();
//       });
//     model.on("change:index", () => {
//     IndexInput.value = model.get("index");
//       });
    
//     IndexGroup.appendChild(IndexLabel);
//     IndexGroup.appendChild(IndexInput);

//       // === Append All Groups ===
// //Stacked one on top of the other

//       container.appendChild(IndexGroup);
//       el.appendChild(container);
//     }

    const IndexGroup = document.createElement("div");
    IndexGroup.style.display = "flex";
    IndexGroup.style.alignItems = "center";
    IndexGroup.style.gap = "0.5rem";
    
    // const IndexLabel = document.createElement("label");
    // IndexLabel.innerText = "Image:";
    // IndexLabel.title = "FITS selection based on input (starts at 0)";
    
    const decrementButton = document.createElement("button");
    decrementButton.innerHTML = '<span class="mdi mdi-chevron-left mdi-24px"></span>';
    decrementButton.title = "Previous image";
    decrementButton.style.background = "none";
    decrementButton.style.width = "1rem";
    decrementButton.style.height = "1rem";
    decrementButton.style.display = "flex";
    decrementButton.style.alignItems = "center";
    decrementButton.style.justifyContent = "center";
    
    const incrementButton = document.createElement("button");
    incrementButton.innerHTML = '<span class="mdi mdi-chevron-right mdi-24px"></span>';
    incrementButton.title = "Next image";
    incrementButton.style.background = "none";
    incrementButton.style.width = "1rem";
    incrementButton.style.height = "1rem";
    incrementButton.style.display = "flex";
    incrementButton.style.alignItems = "center";
    incrementButton.style.justifyContent = "center";
    
    const IndexInput = document.createElement("input");
    IndexInput.type = "number";
    IndexInput.step = "1";
    IndexInput.min = "0";
    IndexInput.value = model.get("index");
    IndexInput.style.width = "3rem";
    IndexInput.style.textAlign = "center";
    
    // Input change
    IndexInput.addEventListener("input", () => {
      model.set("index", parseInt(IndexInput.value));
      model.save_changes();
    });
    model.on("change:index", () => {
      IndexInput.value = model.get("index");
    });
    
    // Increment/Decrement buttons
    decrementButton.addEventListener("click", () => {
      let newVal = Math.max(0, parseInt(IndexInput.value) - 1);
      IndexInput.value = newVal;
      model.set("index", newVal);
      model.save_changes();
    });
    incrementButton.addEventListener("click", () => {
      let newVal = parseInt(IndexInput.value) + 1;
      IndexInput.value = newVal;
      model.set("index", newVal);
      model.save_changes();
    });
    
    // IndexGroup.appendChild(IndexLabel);
    IndexGroup.appendChild(IndexInput);
    IndexGroup.appendChild(decrementButton);
    IndexGroup.appendChild(incrementButton);


    
      // === Append All Groups ===
//Stacked one on top of the other

      container.appendChild(IndexGroup);
      el.appendChild(container);
    }
