const WORM_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">',
  '<circle cx="3.4" cy="20.6" r="2"/>',
  '<circle cx="7.6" cy="20.4" r="2.2"/>',
  '<circle cx="11.9" cy="19.6" r="2.3"/>',
  '<circle cx="15.9" cy="17.6" r="2.4"/>',
  '<circle cx="18.6" cy="13.9" r="2.5"/>',
  '<path fill-rule="evenodd" d="M19 2.2a4.6 4.6 0 1 1 0 9.2a4.6 4.6 0 1 1 0-9.2Zm0 2.6a2 2 0 1 0 0 4a2 2 0 1 0 0-4Z"/>',
  "</svg>",
].join("");

const WORM_ICON = `data:image/svg+xml,${encodeURIComponent(WORM_SVG)}`;

export { WORM_ICON };
