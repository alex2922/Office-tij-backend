export const invoiceNumber = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-based, so add 1

  let financialYear;
  if (currentMonth >= 4) {
    // If April or later, current year - next year
    financialYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  } else {
    // If before April, previous year - current year
    financialYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
  }

  const prefix = `TIJ${financialYear}`;

  return prefix;
};
