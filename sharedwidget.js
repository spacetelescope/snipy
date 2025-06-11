export function render({ model, el }) {
	let componentType = model.get("component");

	switch (componentType) {
		case "LeftControlPanel":
			renderLeftControlPanel({ model, el });
			break;
        case "RightControlPanel":
			renderRightControlPanel({ model, el });
			break;
		case "TopControlPanel":
			renderTopControlPanel({ model, el });
			break;
		default:
			throw new Error(`Unknown component type ${componentType}`);
	}
}

function renderLeftControlPanel({ model, el }) {
//groups all groups together
      const container = document.createElement("div");
      // container.classList.add("control-widget");

    // === Zoom In Button ===

    const zoominGroup = document.createElement("div");
    const zoominButton = document.createElement("button");
    zoominButton.innerText = "Zoom In";
    zoominButton.style.marginTop = "1rem";
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
    zoomoutButton.innerText = "Zoom Out";
    zoomoutButton.style.marginTop = ".2rem";
    zoomoutButton.addEventListener("click", () => {
      const newWidth = model.get("cropwidth") * 1.5;
      const newHeight = model.get("cropheight") * 1.5;
      model.set("cropwidth", Math.round(newWidth));
      model.set("cropheight", Math.round(newHeight));
      model.save_changes();
    });
    zoomoutGroup.appendChild(zoomoutButton);


    
// // Group Zooms to be inline (next to eachother)
//     const zoomGroup = document.createElement("div");
//     zoomGroup.appendChild(zoominButton);
//     zoomGroup.appendChild(zoomoutButton);

  // // === FITS Index Selection ===

  const IndexGroup = document.createElement("div");
  const IndexLabel = document.createElement("label");
  IndexLabel.innerText = "Index:";
  const IndexInput = document.createElement("input");
  IndexInput.type = "number";
  IndexInput.step = "1";
  IndexInput.min = "0"
  IndexInput.value = model.get("index");
  IndexInput.style.width = "2rem";
  IndexInput.addEventListener("input", () => {
    model.set("index", parseInt(IndexInput.value));
    model.save_changes();
  });
  model.on("change:index", () => {
    IndexInput.value = model.get("index");
  });
  IndexGroup.appendChild(IndexLabel);
  IndexGroup.appendChild(IndexInput);


      // === Append All Groups ===
//Stacked one on top of the other
    
      // container.appendChild(cropwidthGroup);
      // container.appendChild(cropheightGroup);
      container.appendChild(zoominGroup);
      container.appendChild(zoomoutGroup);
      // container.appendChild(zoomGroup);
      container.appendChild(IndexGroup);
      el.appendChild(container);
    }

function renderRightControlPanel({ model, el }) {
//groups all groups together
      const container = document.createElement("div");
      // container.classList.add("control-widget");
      // === Min% ===

      const minGroup = document.createElement("div");
      const minLabel = document.createElement("label");
      minLabel.innerText = "Min%:";
    //Creates Slider
      const minSlider = document.createElement("input");
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
      maxLabel.innerText = "Max%:";
      const maxSlider = document.createElement("input");
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

    
      // === Invert Checkbox ===
    
      const invertGroup = document.createElement("div");
      const invertLabel = document.createElement("label");
      invertLabel.innerText = "Invert:";
    //Create Check Box
      const invertCheck = document.createElement("input");
      invertCheck.type = "checkbox";
      invertCheck.checked = model.get("invert");
      invertCheck.addEventListener("change", () => {
        model.set("invert", invertCheck.checked);
        model.save_changes();
      });
      model.on("change:invert", () => {
        invertCheck.checked = model.get("invert");
      });
      invertGroup.appendChild(invertLabel);
      invertGroup.appendChild(invertCheck);

    
      // === Stretch Dropdown ===

      const stretchGroup = document.createElement("div");
      const stretchLabel = document.createElement("label");
      stretchLabel.innerText = "Stretch:";
      const stretchSelect = document.createElement("select");
      ["linear", "log", "sqrt", "asinh", "sinh"].forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.innerText = option;
        stretchSelect.appendChild(opt);
      });
      stretchSelect.value = model.get("stretch");
      stretchSelect.addEventListener("change", () => {
        model.set("stretch", stretchSelect.value);
        model.save_changes();
      });
      model.on("change:stretch", () => {
        stretchSelect.value = model.get("stretch");
      });
      stretchGroup.appendChild(stretchLabel);
      stretchGroup.appendChild(stretchSelect);

      // === Append All Groups ===
//Stacked one on top of the other
    
      container.appendChild(stretchGroup);
      container.appendChild(minGroup);
      container.appendChild(maxGroup);
      container.appendChild(invertGroup);
      el.appendChild(container);
    }


function renderTopControlPanel({ model, el }) {
	//groups all groups together
      const container = document.createElement("div");
      // container.classList.add("control-widget");
    
      // === RA ===
    //Group the label  input into one. to apply a css for later
      const raGroup = document.createElement("div");
    //Create Label
      const raLabel = document.createElement("label");
    //Name the Label
      raLabel.innerText = "RA:";
    //Create Input
      const raInput = document.createElement("input");
    // Input parameters
    // Defines if input it a number, text, etc
      raInput.type = "number";
    // Step size when using the arrows to increase to decrease number
      raInput.step = "0.0001";
    // Number of decimal points for float
      raInput.value = model.get("ra").toFixed(5);
    //Padding for width of input box
      raInput.style.width = "10rem";
    //talks back with traitlets to update input when changed
      raInput.addEventListener("input", () => {
        model.set("ra", parseFloat(raInput.value));
        model.save_changes();
      });
    //Applies and changes the value of ra
      model.on("change:ra", () => {
        raInput.value = model.get("ra").toFixed(5);
      });
    //group label and input together
      raGroup.appendChild(raLabel);
      raGroup.appendChild(raInput);

    
      // === DEC ===
    
    //Group the label  input into one. to apply a css for later    
      const decGroup = document.createElement("div");
    //Create Label
      const decLabel = document.createElement("label");
    //Name the Label
      decLabel.innerText = "DEC:";
    //Create Input
      const decInput = document.createElement("input");

        // Input parameters
    // Defines if input it a number, text, etc
      decInput.type = "number";
    // Step size when using the arrows to increase to decrease number
      decInput.step = "0.00001";
    // Number of decimal points for float
      decInput.value = model.get("dec").toFixed(5);
    //Padding for width of input box
      decInput.style.width = "10rem";
    //talks back with traitlets to update input when changed
      decInput.addEventListener("input", () => {
        model.set("dec", parseFloat(decInput.value));
        model.save_changes();
      });
    //Applies and changes the value of ra
      model.on("change:dec", () => {
        decInput.value = model.get("dec").toFixed(5);
      });
    //group label and input together
      decGroup.appendChild(decLabel);
      decGroup.appendChild(decInput);



    // // Group Coords to be inline (next to eachother)
    // const coordGroup = document.createElement("div");
    // coordGroup.appendChild(raLabel);
    // coordGroup.appendChild(raInput);
    // coordGroup.appendChild(decLabel);
    // coordGroup.appendChild(decInput);


    
      // // === Crop Size Width ===
    
      const cropwidthGroup = document.createElement("div");
      const cropwidthLabel = document.createElement("label");
      cropwidthLabel.innerText = "Crop Width:";
      const cropwidthInput = document.createElement("input");
      cropwidthInput.type = "number";
      cropwidthInput.step = "any";
      cropwidthInput.value = model.get("cropwidth");
      cropwidthInput.style.width = "6.67rem";
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
      const cropheightInput = document.createElement("input");
      cropheightInput.type = "number";
      cropheightInput.step = "any";
      cropheightInput.value = model.get("cropheight");
      cropheightInput.style.width = "7rem";
      cropheightInput.addEventListener("input", () => {
        model.set("cropheight", parseInt(cropheightInput.value));
        model.save_changes();
      });
      model.on("change:cropheight", () => {
        cropheightInput.value = model.get("cropheight");
      });
      cropheightGroup.appendChild(cropheightLabel);
      cropheightGroup.appendChild(cropheightInput);


    // // Group Coords to be inline (next to eachother)
    // const CropGroup = document.createElement("div");
    // CropGroup.appendChild(cropwidthLabel);
    // CropGroup.appendChild(cropwidthInput);
    // CropGroup.appendChild(cropheightLabel);
    // CropGroup.appendChild(cropheightInput);
    
    
      // === Append All Groups ===
//Stacked one on top of the other
    
      container.appendChild(raGroup);
      container.appendChild(decGroup);
      // container.appendChild(coordGroup);
      container.appendChild(cropwidthGroup);
      container.appendChild(cropheightGroup);
      // container.appendChild(CropGroup);
      el.appendChild(container);
    }
