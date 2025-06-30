class Tooltip {
  element;
  tooltipeText;
  static #instance;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;
  }
  render(str) {
    this.element = this.createElement(`<div class="tooltip">${str}</div>`);
    document.body.append(this.element);
    return this.element;
  }

  initialize() {
    document.addEventListener('pointerover', this.pointerOver);
    document.addEventListener('pointerout', this.pointerOut);
  }
  pointerOver = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const tooltipe = event.target.dataset.tooltip;
    if (tooltipe) {
      if (this.element) {
        this.remove();
      }
      this.render(tooltipe);
      this.element.style.position = 'absolute';
      this.element.style.left = `${x + 10}px`;
      this.element.style.top = `${y + 10}px`;

    }
  }

  pointerOut = () => {
    if (this.element) {
      this.remove();
    }
  }


  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.pointerOver);
    document.removeEventListener('pointerout', this.pointerOut);

  }
}

export default Tooltip;
