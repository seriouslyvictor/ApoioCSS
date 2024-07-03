const dataLoader = function () {
  const elements = document.querySelectorAll(
    ".code--snippet input, .code--snippet select"
  );

  elements.forEach((element) => {
    // Get the previous sibling node which should be a text node
    let prevNode = element.previousSibling;

    // Ensure we're only processing text nodes and skipping any inadvertent white space or line breaks
    while (prevNode && prevNode.nodeType !== Node.TEXT_NODE) {
      prevNode = prevNode.previousSibling;
    }

    if (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
      const text = prevNode.textContent.trim();
      const propertyName = text.match(/([a-z-]+)\s*:/i);

      if (propertyName && propertyName[1]) {
        element.setAttribute("data-property", propertyName[1]);
      }
    }
  });
};
const autoFormatter = function () {
  const codeBlocks = document.querySelectorAll(".code--snippet pre");

  codeBlocks.forEach((block) => {
    let html = block.innerHTML;

    const selectorPattern = /(?<=\b|^|\s|\})([.#]?[\w-]+)(?=\s*\{)/g;
    const propertyPattern = /(\b[a-z-]+)(?=\s*:)/gi;
    const unitPattern =
      /(\bpx|\bem|\brem|\b%|\bvh|\bvw|\bin|\bcm|\bmm|\bpt|\bpc|\bex|\bch|\bvmin|\bvmax)\b/g;

    function wrapWithSpan(text, className) {
      return text.replace(
        new RegExp(text, "g"),
        `<span class="${className}">$&</span>`
      );
    }

    html = html.replace(selectorPattern, (match) =>
      wrapWithSpan(match, "selector")
    );
    html = html.replace(propertyPattern, (match) =>
      wrapWithSpan(match, "property")
    );
    html = html.replace(unitPattern, (match) => wrapWithSpan(match, "unidade"));

    block.innerHTML = html;
  });
};

document.addEventListener("DOMContentLoaded", dataLoader);
document.addEventListener("DOMContentLoaded", autoFormatter);
document.addEventListener("DOMContentLoaded", function () {
  // Ensure inputs and selects are queried after the DOM is fully loaded
  const codeInputs = document.querySelectorAll(".code--snippet input");
  const spans = document.querySelectorAll("aside span");
  const codeSelects = document.querySelectorAll(".code--snippet select");
  const dts = document.querySelectorAll("dt");
  const icons = document.querySelectorAll(".dock");
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
  function ajustarSpans() {
    spans.forEach((s) => {
      const propriedade = s.dataset.property;
      const origem = s.dataset.target;
      const el = document.querySelector(origem);
      const css = window.getComputedStyle(el);
      s.textContent = css[propriedade];
    });
  }
  ajustarSpans();
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
    input.addEventListener("input", ajustarSpans);
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
