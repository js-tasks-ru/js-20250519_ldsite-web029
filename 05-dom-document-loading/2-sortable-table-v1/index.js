export default class SortableTable {
  element;
  subElements = {};
  constructor(headerConfig = [], data = [] = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplate());
    this.subElements = {
      body: this.element.querySelector('.sortable-table__body')
    };
  }
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template.trim();
    return element.firstElementChild;
  }
  createClassIcon = (item) => item ? 'sortable-table__sort-arrow' : '';
  createElementIcon = (item) => item ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                                        <span class="sort-arrow"></span>
                                      </span>` : "";

  createTemplateHeader() {
    return this.headerConfig.map(item => {
      
      return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" ><span>${item.title} </span>${this.createElementIcon(item.sortable)}</div>`;
    }).join('');
  }
  createTemplateBody(data = this.data) {
    return data.map(item => {
      const row = this.headerConfig.map(column => {
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
  createTemplate() {
    return (`
            <div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
              <div data-element="header" class="sortable-table__header sortable-table__row">${this.createTemplateHeader()} </div>
              <div data-element="body" class="sortable-table__body">${this.createTemplateBody()}</div>
            </div></div>
            `);
  }
  sort(field, order = "asc") {
    const column = this.headerConfig.find(item => item.id === field);
    if (!column || !column.sortable) return;

    const sortTo = order === 'asc' ? 1 : -1;
    const sortType = column.sortType;
    const sortedData = [...this.data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (sortType === 'string') {
        return sortTo * aVal.localeCompare(bVal, ['ru', 'en'], { caseFirst: 'upper' });
      }

      if (sortType === 'number') {
        return sortTo * (aVal - bVal);
      }

      return 0;
    });

    this.subElements.body.innerHTML = this.createTemplateBody(sortedData);
  }
  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }


}

