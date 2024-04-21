document.addEventListener("DOMContentLoaded", () => {
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
});
