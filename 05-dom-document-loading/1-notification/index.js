export default class NotificationMessage {
    element;

    static lastShownComponent;
    constructor(message = '', {
        type = '',
        duration = 1000
    } = {}) {
        this.type = type;
        this.duration = duration;
        this.message = message;
        this.element = this.createElement(this.createTemplate());
    }
    remove() {
        if (this.element) {   
            this.element.remove();
            this.element = null;
        }
    }
    show(targetElement = document.body) {
        if (NotificationMessage.lastShownComponent) {
            NotificationMessage.lastShownComponent.remove();
        }
        this.element = this.createElement(this.createTemplate());
        targetElement.appendChild(this.element);
        NotificationMessage.lastShownComponent = this;
        if (this.duration > 0) {
            this.timerId = setTimeout(() => this.remove(), this.duration);
        }
    }
    
    createElement(template) {
        const element = document.createElement('div');
        element.innerHTML = template.trim();
        return element.firstElementChild;
    }
    createTemplate() {
        return (`
                <div class="notification ${this.type}" style="--value:20s">
                    <div class="timer"></div>
                    <div class="inner-wrapper">
                      <div class="notification-header">success</div>
                      <div class="notification-body">
                        ${this.message}
                      </div>
                    </div>
                  </div>
                `);
    }
    destroy() {
        this.remove();
    }
}