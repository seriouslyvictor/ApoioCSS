let inputs = document.querySelectorAll("input");
const dts = document.querySelectorAll("dt");

for (const input of inputs) {
  input.addEventListener("input", alterarCaixa);
}

dts.forEach((dt) => {
  const span = document.createElement("span");
  span.className = "grad--text";
  span.textContent = dt.textContent;
  dt.textContent = "";
  dt.appendChild(span);
});

document.addEventListener("DOMContentLoaded", function () {
  function setInputDefaults() {
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
  setInputDefaults();
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".code--snippet input").forEach((input) => {
    adjustInputWidth(input);
    input.addEventListener("input", () => adjustInputWidth(input));
  });
});

function adjustInputWidth(input) {
  const size = input.value.length;
  input.style.width = `${size + 1.5}ch`;
}

function alterarCaixa(e) {
  const target = e.target;
  const property = target.dataset.property;
  const resultados = target.dataset.target;
  const valor = target.value;
  let unit = "";
  if (
    target.nextElementSibling &&
    target.nextElementSibling?.classList.contains("unidade")
  ) {
    unit = target.nextElementSibling.textContent;
  } else {
    unit = "";
  }

  const el = document.querySelector(resultados);
  el.style[property] = valor + unit;
}
