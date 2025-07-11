export class SortableTableV1 {
  element;
  subElements = {};
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template.trim();
    return element.firstElementChild;
  }
  createClassIcon = (item) => (item ? "sortable-table__sort-arrow" : "");
  createElementIcon = (item) =>
    item
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                                        <span class="sort-arrow"></span>
                                      </span>`
      : "";

  createTemplateHeader() {
    return this.headerConfig
      .map((item) => {
        return `<div class="sortable-table__cell" data-id="${item.id
          }" data-sortable="${item.sortable}" ><span>${item.title
          } </span>${this.createElementIcon(item.sortable)}</div>`;
      })
      .join("");
  }
  createTemplateBody(data = this.data) {
    return data
      .map((item) => {
        const row = this.headerConfig
          .map((column) => {
            let cell;
            if (column.template) {
              cell = `${column.template(item[column.id])}`;
            } else {
              cell = `<div class="sortable-table__cell">${item[column.id]
                }</div>`;
            }
            return `${cell}`;
          })
          .join("");
        return `<a href="/products/${item.id}" class="sortable-table__row">${row}</a>`;
      })
      .join("");
  }
  createTemplate() {
    return `
            <div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
              <div data-element="header" class="sortable-table__header sortable-table__row">${this.createTemplateHeader()} </div>
              <div data-element="body" class="sortable-table__body">${this.createTemplateBody()}</div>
            </div></div>
            `;
  }
  sort(field, order = "asc") {
    const column = this.headerConfig.find((item) => item.id === field);
    if (!column || !column.sortable) return;

    const sortTo = order === "asc" ? 1 : -1;
    const sortType = column.sortType;
    const sortedData = [...this.data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (sortType === "string") {
        return (
          sortTo *
          aVal.localeCompare(bVal, ["ru", "en"], { caseFirst: "upper" })
        );
      }

      if (sortType === "number") {
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
  }
}
export default class SortableTable extends SortableTableV1 {
  element;
  subElements = {};
  constructor(headerConfig = [], data = []) {
    super(headerConfig, data);
    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements(this.element);
  }
  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }
}
