  // Select all input and select elements within .code--snippet blocks
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
      // Extract the relevant text which is generally a CSS property from the text node
      const text = prevNode.textContent.trim();
      // Use a regular expression to extract the property name before the colon
      const propertyName = text.match(/([a-z-]+)\s*:/i);

      if (propertyName && propertyName[1]) {
        // Set the data-property attribute with the extracted property name
        element.setAttribute("data-property", propertyName[1]);
      }
    }
  }); 



