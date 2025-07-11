import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js"

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  page = 0;
  page_per = 30;
  start = 0;
  isLoading = false;
  constructor(headersConfig, {
    url = '', isSortLocally = false,
  } = {}) {
    super(headersConfig, { data: [], sorted: { id: 'title', order: 'asc' } });
    this.url = url;
    super.element = this.createElement(this.createTemplate());
    this.subElements = super.getSubElements(this.element);
    this.isSortLocally = isSortLocally;
    super.createArrowElement();
    super.handleHeaderCellClick();
    this.start = this.page;
    this.end = this.start + this.page_per;
    this.pagination(this.start);

    if (this.sorted.id && this.sorted.order) {
      const currentCell = this.subElements.header;
      if (currentCell) currentCell.append(this.arrowElement);
      this.sort(this.sorted.id, this.sorted.order);
    }

    this.createScroll();
  }

  loadData = (data) => {
    const html = super.createTemplateBody(data);
    if (this.start == 0) {
      this.subElements.body.innerHTML = html;
    } else {
      this.subElements.body.insertAdjacentHTML('beforeend', html);
    }
  }
  // sortOnClient(id, order) { }

  sortOnServer(id, order) {
    this.start = 0;
    this.end = 30;
    this.render(id, order);
  }
  pagination(page) {
    this.start = page;
    this.end = this.start + this.page_per;
  }
  async render(id, order) {
    try {
      const response = await fetch(`${BACKEND_URL}/${this.url}?_sort=${id}&_order=${order}&_start=${this.start}&_end=${this.end}`);
      const data = await response.json();
      this.data = Object.values(data);
      this.loadData(data);
      this.subElements.header.querySelectorAll('.sortable-table__cell')
        .forEach(cell => {
          cell.dataset.order = cell.dataset.id === id ? order : '';
        });
      return data;
    } catch (err) {
      // console.log(err);
    }
  }
  scrollTable = async () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 100 && !this.isLoading) {
      this.isLoading = true;
      this.pagination(this.end + 1);
      await this.render(this.sorted.id, this.sorted.order);
      this.isLoading = false;
    }
  }
  createScroll() {
    document.addEventListener('scroll', this.scrollTable);
  }
  destroy() {
    this.remove();
    document.removeEventListener('scroll', this.scrollTable);
  }
}

