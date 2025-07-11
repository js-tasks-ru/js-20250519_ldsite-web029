export default class ColumnChart {
    element;
    chartHeight = 50;
    subElements={};
    constructor({
        data = [],
        label = '',
        value = 0,
        link = '',
        formatHeading = value => value
    } = {}) {
        this.label = label;
        this.link = link;
        this.value = value;
        this.formatHeading = formatHeading;
        this.data = data;

        this.element = this.createElement(this.createTemplate());
        this.subElements = {
      header: this.element.querySelector(".column-chart__title"),
      body: this.element.querySelector("[data-element='body']"),
    };
    }
    createElement(template) {
        const element = document.createElement('div');
        element.innerHTML = template;
        return element.firstElementChild;
    }
    createLinkTemplate() {
        if (this.link) {
            return (`<a href="${this.link}" class="column-chart__link">View all</a>`);
        }
        return '';

    }
    getColumnProps() {
        if (!this.data || this.data.length === 0) {
            return [];
        }
        if (!Array.isArray(this.data)) {
            this.data = Object.values(this.data);
        }

        const maxValue = Math.max(...this.data);

        const scale = 50 / maxValue;
        return this.data.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
    }
    createChartBodyTemplate() {
        return this.getColumnProps().map(item => {
            return `<div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>`;
        }).join('');

    }
    createChartClasses() {
        const data = Array.isArray(this.data) ? this.data : Object.values(this.data);
        return data.length ? 'column-chart' : 'column-chart column-chart_loading';
    }
    createTemplate() {
        return (`
                <div class="${this.createChartClasses()}" style="--chart-height: 50">
                      <div class="column-chart__title">
                        ${this.label}
                        ${this.createLinkTemplate()}
                      </div>
                      <div class="column-chart__container">
                        <div data-element="header" class="column-chart__header"> ${this.formatHeading(this.value)}</div>
                        <div data-element="body" class="column-chart__chart">
                         ${this.createChartBodyTemplate()}
                        </div>
                      </div>
                    </div>
                `);
    }
    update(newData) {
        this.data = newData;
        this.subElements.body.innerHTML = this.createChartBodyTemplate();
    }
    remove() {
        this.element.remove();
    }
    destroy() {
        this.remove();
    }
}
