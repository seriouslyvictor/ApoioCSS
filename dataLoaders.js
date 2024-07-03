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
document.addEventListener("DOMContentLoaded", dataLoader);
