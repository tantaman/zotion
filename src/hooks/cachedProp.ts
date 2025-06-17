import {useState} from 'react';

export function useCachedProp<T>(prop: T, filter?: (value: T) => boolean) {
  const [priorProp, setPriorProp] = useState<T | null>(prop);
  const [currValue, setCurrValue] = useState<T>(prop);

  if (prop !== priorProp && (!filter || filter(prop))) {
    setPriorProp(prop);
    setCurrValue(prop);
  }

  return [currValue, setCurrValue] as const;
}
