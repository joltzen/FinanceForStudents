export const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
].map((label, index) => ({ value: index + 1, label }));

export const years = Array.from(
  { length: 10 },
  (_, index) => new Date().getFullYear() - index
);
