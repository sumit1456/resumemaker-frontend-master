import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onCLS(onPerfEntry);
        onFCP(onPerfEntry);
        onINP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
    }
};

export default reportWebVitals;
