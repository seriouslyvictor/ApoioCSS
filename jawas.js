const inputs = document.querySelectorAll("input");
const selects = document.querySelectorAll("select");
const dts = document.querySelectorAll("dt");

for (const input of inputs) {
  input.addEventListener("input", alterarElemento);
}
for (const select of selects) {
  select.addEventListener("change", alterarElemento);
}

dts.forEach((dt) => {
  const span = document.createElement("span");
  span.className = "grad--text";
  span.textContent = dt.textContent;
  dt.textContent = "";
  dt.appendChild(span);
});

document.addEventListener("DOMContentLoaded", function () {
  function definirDefaults() {
    document.querySelectorAll(".code--snippet input").forEach((input) => {
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
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".code--snippet input").forEach((input) => {
    ajustarTamanhoInputs(input);
    input.addEventListener("input", () => ajustarTamanhoInputs(input));
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

// Adding event listeners for both inputs and selects on document ready
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(
    "input[data-property], select[data-property]"
  );
  elements.forEach((element) => {
    element.addEventListener("change", alterarElemento);
  });
});
