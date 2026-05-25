import { useEffect, useState } from 'react';

import { mockDashboardStats } from '../mock/dashboard';

type Listener = () => void;

let openEscalationCount = mockDashboardStats.openEscalations;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getOpenEscalationCount(): number {
  return openEscalationCount;
}

export function decrementOpenEscalationCount(): number {
  openEscalationCount = Math.max(0, openEscalationCount - 1);
  emitChange();
  return openEscalationCount;
}

export function subscribeOpenEscalationCount(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useOpenEscalationCount(): number {
  const [count, setCount] = useState(() => getOpenEscalationCount());

  useEffect(() => subscribeOpenEscalationCount(() => setCount(getOpenEscalationCount())), []);

  return count;
}