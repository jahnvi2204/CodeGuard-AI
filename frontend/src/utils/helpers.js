export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getSeverityColor = (severity) => {
  const colors = {
    'Critical': 'from-red-600 to-red-800',
    'High': 'from-orange-500 to-red-600',
    'Medium': 'from-yellow-500 to-orange-500',
    'Low': 'from-blue-500 to-blue-600'
  };
  return `bg-gradient-to-r ${colors[severity] || 'from-gray-500 to-gray-600'}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
