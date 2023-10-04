class EventBus {
  events: { [index: string]: Function[] };
  constructor() {
    this.events = {};
  }
  $on(eventName: string, fn: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }
  $emit(eventName: string, ...args: any[]) {
    if (this.events[eventName] && this.events[eventName].length) {
      this.events[eventName].forEach((callback) => {
        callback.apply(this, args);
      });
    }
    return;
  }
  $remove(eventName: string, callback: Function) {
    if (this.events[eventName] && this.events[eventName].length) {
      this.events[eventName].filter((cb) => cb !== callback);
    }
  }
  $clear(eventName: string) {}
}

export const eventBus = new EventBus();
