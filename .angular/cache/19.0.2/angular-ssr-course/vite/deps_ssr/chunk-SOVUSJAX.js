import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Injectable,
  NgZone,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-QLHJKBH6.js";
import {
  require_cjs
} from "./chunk-TDK5NIWS.js";
import {
  require_operators
} from "./chunk-WBQSER3X.js";
import {
  __toESM
} from "./chunk-YHCV7DAQ.js";

// node_modules/@angular/cdk/fesm2022/observers/private.mjs
var import_rxjs = __toESM(require_cjs(), 1);
var import_operators = __toESM(require_operators(), 1);
var loopLimitExceededErrorHandler = (e) => {
  if (e instanceof ErrorEvent && e.message === "ResizeObserver loop limit exceeded") {
    console.error(`${e.message}. This could indicate a performance issue with your app. See https://github.com/WICG/resize-observer/blob/master/explainer.md#error-handling`);
  }
};
var SingleBoxSharedResizeObserver = class {
  _box;
  /** Stream that emits when the shared observer is destroyed. */
  _destroyed = new import_rxjs.Subject();
  /** Stream of all events from the ResizeObserver. */
  _resizeSubject = new import_rxjs.Subject();
  /** ResizeObserver used to observe element resize events. */
  _resizeObserver;
  /** A map of elements to streams of their resize events. */
  _elementObservables = /* @__PURE__ */ new Map();
  constructor(_box) {
    this._box = _box;
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => this._resizeSubject.next(entries));
    }
  }
  /**
   * Gets a stream of resize events for the given element.
   * @param target The element to observe.
   * @return The stream of resize events for the element.
   */
  observe(target) {
    if (!this._elementObservables.has(target)) {
      this._elementObservables.set(target, new import_rxjs.Observable((observer) => {
        const subscription = this._resizeSubject.subscribe(observer);
        this._resizeObserver?.observe(target, {
          box: this._box
        });
        return () => {
          this._resizeObserver?.unobserve(target);
          subscription.unsubscribe();
          this._elementObservables.delete(target);
        };
      }).pipe(
        (0, import_operators.filter)((entries) => entries.some((entry) => entry.target === target)),
        // Share a replay of the last event so that subsequent calls to observe the same element
        // receive initial sizing info like the first one. Also enable ref counting so the
        // element will be automatically unobserved when there are no more subscriptions.
        (0, import_operators.shareReplay)({
          bufferSize: 1,
          refCount: true
        }),
        (0, import_operators.takeUntil)(this._destroyed)
      ));
    }
    return this._elementObservables.get(target);
  }
  /** Destroys this instance. */
  destroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._resizeSubject.complete();
    this._elementObservables.clear();
  }
};
var SharedResizeObserver = class _SharedResizeObserver {
  /** Map of box type to shared resize observer. */
  _observers = /* @__PURE__ */ new Map();
  /** The Angular zone. */
  _ngZone = inject(NgZone);
  constructor() {
    if (typeof ResizeObserver !== "undefined" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      this._ngZone.runOutsideAngular(() => {
        window.addEventListener("error", loopLimitExceededErrorHandler);
      });
    }
  }
  ngOnDestroy() {
    for (const [, observer] of this._observers) {
      observer.destroy();
    }
    this._observers.clear();
    if (typeof ResizeObserver !== "undefined" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      window.removeEventListener("error", loopLimitExceededErrorHandler);
    }
  }
  /**
   * Gets a stream of resize events for the given target element and box type.
   * @param target The element to observe for resizes.
   * @param options Options to pass to the `ResizeObserver`
   * @return The stream of resize events for the element.
   */
  observe(target, options) {
    const box = options?.box || "content-box";
    if (!this._observers.has(box)) {
      this._observers.set(box, new SingleBoxSharedResizeObserver(box));
    }
    return this._observers.get(box).observe(target);
  }
  static ɵfac = function SharedResizeObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedResizeObserver)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _SharedResizeObserver,
    factory: _SharedResizeObserver.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedResizeObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  SharedResizeObserver
};
//# sourceMappingURL=chunk-SOVUSJAX.js.map