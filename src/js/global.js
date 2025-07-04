export function rangoAltura(height) {
  if (!height) return "Desconocido";
  const partes = height.split(" - ").map(Number);
  const minAlt = partes[0] || 0;
  if (minAlt <= 35) return "Pequeño";
  if (minAlt <= 60) return "Mediano";
  return "Grande";
}

export function debounce(funcionDebounceada, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => funcionDebounceada.apply(null, args), delay);
  };
}
