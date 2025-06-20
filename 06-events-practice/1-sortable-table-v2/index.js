export default class SortableTable {
  element;
  subElements = {};
  arrowElement;
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.element = this.createElement(this.createTemplate());
    this.subElements = {
      header: this.element.querySelector('.sortable-table__header'),
      body: this.element.querySelector('.sortable-table__body')
    };
    this.isSortLocally = true;
    this.createArrowElement();
    this.handleHeaderCellClick();

    if (this.sorted.id && this.sorted.order) {
      const currentCell = this.subElements.header.querySelector(`[data-id="${this.sorted.id}"]`);
      if (currentCell) currentCell.append(this.arrowElement);
      this.sort(this.sorted.id, this.sorted.order);
    }
  }
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template.trim();
    return element.firstElementChild;
  }
  createArrowElement() {
    this.arrowElement = this.createElement(this.createArrowTemplate());
  }
  createArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>`
  }

  createTemplateHeader() {
    return this.headersConfig.map(item => {
      const order = this.sorted.id === item.id ? this.sorted.order : '';
      return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${order}"><span>${item.title} </span></div>`;
    }).join('');
  }
  createTemplateBody(data = this.data) {
    return data.map(item => {
      const row = this.headersConfig.map(column => {
        let cell;
        if (column.id === 'images') {
          cell = `<img class="sortable-table-image" alt="Image" src="${item.images[0].url}"/>`;
        } else {
          cell = `${item[column.id]}`;
        }
        return `<div class="sortable-table__cell">${cell}</div>`;
      }).join('');
      return `<a href="/products/${item.id}" class="sortable-table__row">${row}</a>`;
    }).join('');
  }
  handleHeaderCellClick() {
    this.subElements.header.addEventListener('pointerdown', event => {
      const cellElement = event.target.closest('.sortable-table__cell');

      if (!cellElement) return;
      if (cellElement.dataset.sortable !== "true") {
        return;
      }
      const sortField = cellElement.dataset.id;
      const currentOrder = cellElement.dataset.order;
      const sortOrder = currentOrder ? (currentOrder === 'asc' ? 'desc' : 'asc') : 'desc';
      cellElement.append(this.arrowElement);
      this.sort(sortField, sortOrder);
    });
  }
  createTemplate() {
    return (`<div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
              <div data-element="header" class="sortable-table__header sortable-table__row">${this.createTemplateHeader()} </div>
              <div data-element="body" class="sortable-table__body">${this.createTemplateBody()}</div>
            </div></div>
            `);
  }
  sortOnClient(field, order) {
    const column = this.headersConfig.find(item => item.id === field);
    if (!column || !column.sortable) return;
    const sortTo = order === 'asc' ? 1 : -1;
    const sortType = column.sortType;
    const sortedData = [...this.data].sort((a, b) => {
      let aVal = a[field],
        bVal = b[field];

      if (sortType === 'string') {
        return sortTo * aVal.localeCompare(bVal, ['ru', 'en'], { caseFirst: 'upper' });
      }

      if (sortType === 'number') {
        return sortTo * (aVal - bVal);
      }

      return 0;
    });
    this.subElements.body.innerHTML = this.createTemplateBody(sortedData);
    this.subElements.header.querySelectorAll('.sortable-table__cell').forEach(th => {
      th.dataset.order = th.dataset.id === field ? order : '';
    });
  }
  sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }
  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
  createListeners() {
    this.subElements.header.addEventListener('click', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('click', this.handleHeaderCellClick);
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

