import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({ endValue, duration = 1200, formatter, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(endValue) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  const display = formatter ? formatter(count) : Math.round(count).toLocaleString('en-IN');

  return (
    <span>
      {prefix}{display}{suffix}
    </span>
  );
}
