export type Handler<T> = (value: T) => void;
export type Unobserve = () => void;
export type Observable<T> = (hdl: Handler<T>) => [T, Unobserve];

export function subject<T>(initialValue: T): [Observable<T>, Handler<T>] {
  let value = initialValue;
  let index = 0;
  const observers: Record<number, Handler<T>> = {};
  const observe: Observable<T> = (observer: Handler<T>) => {
    const idx = index ++;
    observers[idx] = observer;
    return [value, () => {
      delete observers[idx];
    }];
  };
  const notify = (newValue: T) => {
    value = newValue;
    Object.values(observers).forEach((observer) => observer(newValue));
  };
  return [observe, notify];
}

export function fmap<T, U>(f: (value: T) => U) {
  return (ob: Observable<T>): Observable<U> => {
    // This could be optimized, avoid eagerly observe
    const [value, unob] = ob((newValue) => {
      notify(f(newValue));
    });

    const [observe, notify] = subject(f(value));

    return observe;
  }
}