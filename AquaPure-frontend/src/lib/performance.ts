// Performance monitoring utilities

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
}

export const getPerformanceMetrics = (): PerformanceMetrics | null => {
  if (typeof window === "undefined" || !window.performance) return null;

  const perfData = window.performance.timing;
  const navigationStart = perfData.navigationStart;

  const metrics: PerformanceMetrics = {
    pageLoadTime: perfData.loadEventEnd - navigationStart,
    domContentLoaded: perfData.domContentLoadedEventEnd - navigationStart,
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    timeToInteractive: perfData.domInteractive - navigationStart,
  };

  // Get paint metrics
  const paintEntries = performance.getEntriesByType("paint");
  paintEntries.forEach((entry) => {
    if (entry.name === "first-paint") {
      metrics.firstPaint = entry.startTime;
    } else if (entry.name === "first-contentful-paint") {
      metrics.firstContentfulPaint = entry.startTime;
    }
  });

  // Get LCP
  const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
  if (lcpEntries.length > 0) {
    const lastEntry = lcpEntries[lcpEntries.length - 1] as any;
    metrics.largestContentfulPaint = lastEntry.startTime;
  }

  return metrics;
};

export const logPerformanceMetrics = () => {
  const metrics = getPerformanceMetrics();
  if (!metrics) return;

  console.group("Performance Metrics");
  console.log(`Page Load Time: ${metrics.pageLoadTime}ms`);
  console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
  console.log(`First Paint: ${metrics.firstPaint}ms`);
  console.log(`First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
  console.log(`Largest Contentful Paint: ${metrics.largestContentfulPaint}ms`);
  console.log(`Time to Interactive: ${metrics.timeToInteractive}ms`);
  console.groupEnd();

  return metrics;
};

// Monitor Core Web Vitals
export const monitorWebVitals = (callback: (metric: any) => void) => {
  // LCP - Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    callback({
      name: "LCP",
      value: lastEntry.startTime,
      rating: lastEntry.startTime < 2500 ? "good" : lastEntry.startTime < 4000 ? "needs-improvement" : "poor",
    });
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  // FID - First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      callback({
        name: "FID",
        value: entry.processingStart - entry.startTime,
        rating: entry.processingStart - entry.startTime < 100 ? "good" : entry.processingStart - entry.startTime < 300 ? "needs-improvement" : "poor",
      });
    });
  });
  fidObserver.observe({ entryTypes: ["first-input"] });

  // CLS - Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    callback({
      name: "CLS",
      value: clsValue,
      rating: clsValue < 0.1 ? "good" : clsValue < 0.25 ? "needs-improvement" : "poor",
    });
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });
};

// Resource timing
export const getResourceTimings = () => {
  const resources = performance.getEntriesByType("resource");
  
  const timings = resources.map((resource: any) => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType,
  }));

  return timings;
};

// Memory usage (if available)
export const getMemoryUsage = () => {
  if (typeof window === "undefined") return null;
  
  const memory = (performance as any).memory;
  if (!memory) return null;

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
};
