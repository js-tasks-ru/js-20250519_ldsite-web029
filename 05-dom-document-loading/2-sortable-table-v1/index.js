export default class SortableTable {
  element;
  subElements = {};
  constructor(headerConfig = [], data = [] = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplate());
    this.subElements = {
      body: this.element.querySelector('tbody')
    };
  }
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template.trim();
    return element.firstElementChild;
  }
  createTemplateHeader() {
    return this.headerConfig.map(item => {
      return `
      <th>${item.title}</th>
      `;
    }).join('');
  }
  createTemplateBody(data = this.data) {
    return data.map(item => {
      const row = this.headerConfig.map(column => {
        if (column.id === 'images') {
          return `<td><div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${item?.images?.[0]?.url || 'https://via.placeholder.com/32'}">
        </div></td>`;
        }
        return `<td>${item[column.id]}</td>`;
      }).join('');
      return `<tr>${row}</tr>`;
    }).join('');
  }
  createTemplate() {
    return (`
            <table>
              <thead><tr>${this.createTemplateHeader()}</tr> </thead>
              <tbody>${this.createTemplateBody()}</tbody>
            </table>
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

