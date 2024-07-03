document.addEventListener("DOMContentLoaded", function () {
  // Ensure inputs and selects are queried after the DOM is fully loaded
  const codeInputs = document.querySelectorAll(".code--snippet input");
  const codeSelects = document.querySelectorAll(".code--snippet select");
  const dts = document.querySelectorAll("dt");
  const icons = document.querySelectorAll("i");

  // Handle dt elements and span creation
  dts.forEach((dt) => {
    const span = document.createElement("span");
    span.className = "grad--text";
    span.textContent = dt.textContent;
    dt.textContent = "";
    dt.appendChild(span);
  });

  icons.forEach((icon) => {
    const container = icon.parentElement;
    icon.addEventListener("click", () => {
      icon.classList.add("fa-beat");
      undockWindow(container);
      setTimeout(() => {
        icon.classList.remove("fa-beat");
      }, 1000);
    });
  });

  // Define and execute function to set default values for inputs
  function definirDefaults() {
    codeInputs.forEach((input) => {
      if (input.hasAttribute("value")) return;

      const property = input.dataset.property;
      const targetSelector = input.dataset.target;
      const element = document.querySelector(targetSelector);
      if (!element) return;

      const style = window.getComputedStyle(element);

      let usesUnits =
        input.nextElementSibling &&
        input.nextElementSibling.classList.contains("unidade");
      let unit = usesUnits ? input.nextElementSibling.textContent : "";
      console.log(unit);
      input.value = style[property].replace(unit, "");
    });
  }
  definirDefaults();

  // Adjust input sizes and set up event listeners for inputs
  codeInputs.forEach((input) => {
    ajustarTamanhoInputs(input);
    input.addEventListener("input", () => ajustarTamanhoInputs(input));
    input.addEventListener("input", alterarElemento);
    input.addEventListener("change", alterarElemento);
    input.addEventListener("wheel", (e) => scrollInput(e));
  });

  // If using selects, add relevant event listeners or actions here
  codeSelects.forEach((select) => {
    // ajustarTamanhoInputs(select);
    select.addEventListener("input", () => ajustarTamanhoInputs(input));
    select.addEventListener("input", alterarElemento);
    select.addEventListener("change", alterarElemento);
  });
});

function ajustarTamanhoInputs(input) {
  const size = input.value.length;
  input.style.width = `${size + 1.5}ch`;
}

function alterarElemento(e) {
  const target = e.target;
  const property = target.dataset.property;
  const resultados = target.dataset.target;
  const valor = target.value;
  let unit = "";

  // Handle units for input fields associated with a unit span
  if (
    target.nextElementSibling &&
    target.nextElementSibling.classList.contains("unidade")
  ) {
    unit = target.nextElementSibling.textContent;
  }

  // Select the target element based on the data-target attribute
  const el = document.querySelector(resultados);
  if (!el) {
    console.error("No element found with selector: ", resultados);
    return;
  }

  // Apply the style change
  el.style[property] = valor + unit;
}

function scrollInput(e) {
  e.preventDefault();
  let input = e.target;
  let currentValue = input.value.trim();
  const valueParts = currentValue.match(/^(-?\d+)([a-z%]*)$/i);

  if (!valueParts) return;

  let numericValue = parseInt(valueParts[1], 10);
  let unit = valueParts[2];

  if (isNaN(numericValue)) return;

  if (e.deltaY < 0) numericValue += 1;
  else if (e.deltaY > 0) numericValue -= 1;

  input.value = numericValue + unit;
  input.dispatchEvent(new Event("input"));
}

function undockWindow(el) {
  if (el.classList.contains("undocked")) {
    dockWindow(el);
  } else {
    el.classList.add("undocked");
    makeElementDraggable(el);
  }
}

function dockWindow(el) {
  el.classList.remove("undocked");
  el.style.top = "";
  el.style.left = "";
  el.style.transform = "";
}

function makeElementDraggable(element) {
  // Reset the position slightly to create a "pop" effect
  element.style.left = "100px";
  element.style.top = "100px";
  element.onmousedown = function (e) {
    e.preventDefault();
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + "px";
      element.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    element.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      element.onmouseup = null;
    };
  };

  element.ondragstart = function () {
    return false;
  };
}
