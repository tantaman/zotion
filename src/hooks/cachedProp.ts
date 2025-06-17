import {useState} from 'react';

export function useCachedProp<T>(prop: T, filter?: (value: T) => boolean) {
  const [priorProp, setPriorProp] = useState<T | null>(prop);
  const [currValue, setCurrValue] = useState<T>(prop);
  const [dirty, setDirty] = useState(false);

  if (prop !== priorProp && (!filter || filter(prop))) {
    setPriorProp(prop);
    setCurrValue(prop);
    setDirty(false);
  } else if (prop === currValue && dirty) {
    setDirty(false);
  }

  return [
    currValue,
    (v: T) => {
      if (v === currValue) {
        return;
      }
      setDirty(true);
      setCurrValue(v);
    },
    dirty,
  ] as const;
}
