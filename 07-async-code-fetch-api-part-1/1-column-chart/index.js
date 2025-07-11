import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

export default class ColumnChartFromApi extends ColumnChart {
    element;
    subElements = {};
    elementsInput = {};
    constructor({
        label = '',
        url = '',
        link = '',
        range = {},
    } = {}) {
        super({
            data: [],
            label: '',
            value: 0,
            link: '',
            formatHeading: value => value
        })
        this.url = url;
        this.range = range;
        this.label = label;
        this.link = link;

        this.element = this.createElement(this.createTemplate());
        this.subElements = {
            header: this.element.querySelector(".column-chart__title"),
            body: this.element.querySelector("[data-element='body']"),
        };
        this.update(this.range.from, this.range.to);

    }
    loadingVisual() {
        if (this.data && this.data.length) {
            this.element.classList.remove('column-chart_loading');
        } else {
            this.element.classList.add('column-chart_loading');
        }
    }
    getDate=()=> {
        this.update(this.range.from, this.range.to)
    }
    createListeners() {
        document.addEventListener("pointerdown", this.getDate);
    }
    async update(from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        try {
            const response = await fetch(`${BACKEND_URL}/${this.url}?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`);
            const data = await response.json();
            this.data = Object.values(data);
            this.loadingVisual();
            this.subElements.body.innerHTML = this.createChartBodyTemplate();
            return data;
        } catch (err) {
            // console.log(err);
        }
    }
    destroyListeners() {
        document.removeEventListener(
            "pointerdown",
            this.getDate
        );
    }
    remove() {
        if (this.element) {
          this.element.remove();
        }
        this.destroyListeners()
    }

}
