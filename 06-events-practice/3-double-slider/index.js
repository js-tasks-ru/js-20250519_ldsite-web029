export default class DoubleSlider {
    element;
    min;
    max;
    subElements = {};
    activeThumb;
    constructor({
        min = 100,
        max = 200,
        formatValue = value => '$' + value,
        selected = {} } = {}) {

        this.min = min ?? 100;
        this.max = max ?? 200;
        this.formatValue = formatValue;
        this.from = selected.from || min;
        this.to = selected.to || max;

        this.element = this.createElement(this.createTemplate());
        this.selectSubElements();
        this.createListeners();

    }
    getLeftProcent() {
        const length = this.max - this.min;
        const value = this.from - this.min;
        return Math.round(value / length * 100);

    }
    getRightProcent() {
        const length = this.max - this.min;
        // const value = this.from - this.min;
        const value = this.max - this.to;
        return Math.round(value / length * 100);

    }

    createElement(template) {
        const element = document.createElement("div");
        element.innerHTML = template.trim();
        return element.firstElementChild;
    }
    createTemplate() {
        const leftProgress = this.getLeftProcent();
        const rightProgress = this.getRightProcent();
        return `
        <div class="range-slider">
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div data-element="container" class="range-slider__inner">
              <span data-element="thumbProgress" class="range-slider__progress" style="left: ${leftProgress}%; right: ${rightProgress}%"></span>
              <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftProgress}%"></span>
              <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightProgress}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
        `;
    }
    selectSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
            this.subElements[element.dataset.element] = element;
        })

    }
    dispatchCustomEvent() {
        const event = new CustomEvent('range-select', {
            detail: {
                from: this.from,
                to: this.to,
            }
        })
        this.element.dispatchEvent(event);

    }
    handleThumbDocumentPointermove = (e) => {
        const newValue = this.processPointerMove(e);
        //перемещение
        if (this.activeThumb === 'thumbRight') {
           this.to = Math.max(this.from, Math.min(newValue, this.max));
            this.subElements.to.textContent = this.formatValue(this.to);
            this.subElements.thumbRight.style.right = this.getRightProcent() + "%";
            this.subElements.thumbProgress.style.right = this.getRightProcent() + "%";
        }

        if (this.activeThumb === 'thumbLeft') {
             this.from = Math.min(this.to, Math.max(newValue, this.min));
            this.subElements.from.textContent = this.formatValue(this.from);
            this.subElements.thumbLeft.style.left = this.getLeftProcent() + "%";
            this.subElements.thumbProgress.style.left = this.getLeftProcent() + "%";
        }

    }
    handleThumbPointerdown = (e) => {
        this.activeThumb = e.target.dataset.element;
        document.addEventListener('pointermove', this.handleThumbDocumentPointermove);
        document.addEventListener('pointerup', this.handleThumbDocumentPointerup);
    }
    processPointerMove = (e) => {
        // const { left, width } = this.subElements.container.getBoundingClientRect();
        // const containerLeftX = left;
        // const containerRightX = left + width;
        // const pointerX = e.clientX;
        // const normilizedPointerX = Math.min(containerRightX, Math.max(containerLeftX, pointerX));
        // const percentPointerX = Math.round((normilizedPointerX - containerLeftX) / (containerRightX - containerLeftX) * 100);
        // return this.min + (this.max - this.min) * percentPointerX / 100;
        const { left, width } = this.subElements.container.getBoundingClientRect();
    const pointerX = e.clientX;
    const relativeX = Math.min(Math.max(pointerX, left), left + width);
    const percent = (relativeX - left) / width;

    return Math.round(this.min + percent * (this.max - this.min));

    }


    //в момент отжатия обработчики удаляем
    handleThumbDocumentPointerup = (e) => {
        document.removeEventListener('pointermove', this.handleThumbDocumentPointermove);
        document.removeEventListener('pointerup', this.handleThumbDocumentPointerup);
        this.dispatchCustomEvent();
    }

    createListeners() {
        this.subElements.thumbLeft.addEventListener('pointerdown', this.handleThumbPointerdown);
        this.subElements.thumbRight.addEventListener('pointerdown', this.handleThumbPointerdown);
        //pointerdown
        //pointermove
        //pointerup

    }
    destroyListeners() {
        this.subElements.thumbLeft.removeEventListener('pointerdown', this.handleThumbPointerdown);
        this.subElements.thumbRight.removeEventListener('pointerdown', this.handleThumbPointerdown);

    }
    remove() {
        if (this.element) {
            this.element.remove();
        }
        this.destroyListeners()
    }
    destroy() {
        this.remove();
    }

}
