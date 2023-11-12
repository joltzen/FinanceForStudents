// useCalculations.js
export const useCalculations = (
  transactions,
  settings,
  savingsGoals,
  filterMonth,
  filterYear,
  totalSavingGoals
) => {
  const calculateSavingGoalsTotal = () => {
    let totalSavings = 0;

    savingsGoals.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth() + 1;
      const startYear = new Date(goal.startdate).getFullYear();
      const endMonth = new Date(goal.deadline).getMonth() + 1;
      const endYear = new Date(goal.deadline).getFullYear();

      if (
        (filterYear > startYear ||
          (filterYear === startYear && filterMonth >= startMonth)) &&
        (filterYear < endYear ||
          (filterYear === endYear && filterMonth <= endMonth))
      ) {
        totalSavings += parseFloat(goal.monthly_saving);
      }
    });

    return totalSavings;
  };

  const calculateAnnualSavingGoalsTotal = () => {
    let totalSavings = 0;

    savingsGoals.forEach((goal) => {
      const goalStart = new Date(goal.startdate);
      const goalEnd = goal.deadline
        ? new Date(goal.deadline)
        : new Date(goalStart.getFullYear() + 1, 0, 1); // Assuming deadline is the end of the year if not specified

      // Adjust start and end dates if they fall outside the filter year
      const startMonth =
        goalStart.getFullYear() === filterYear ? goalStart.getMonth() + 1 : 1;
      const endMonth =
        goalEnd.getFullYear() === filterYear ? goalEnd.getMonth() + 1 : 12;

      // Calculate savings only if the goal is within the filter year
      if (
        filterYear >= goalStart.getFullYear() &&
        filterYear <= goalEnd.getFullYear()
      ) {
        const monthsInYear = endMonth - startMonth + 1;
        totalSavings += parseFloat(goal.monthly_saving) * monthsInYear;
      }
    });

    return totalSavings;
  };

  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      if (!categoryTotals[transaction.category_id]) {
        categoryTotals[transaction.category_id] = 0;
      }
      categoryTotals[transaction.category_id] += parseFloat(transaction.amount);
    });

    const totalBudget = settings.reduce((acc, setting) => {
      if (setting.transaction_type === "Einnahme") {
        return acc + parseFloat(setting.amount);
      } else if (setting.transaction_type === "Ausgabe") {
        return acc - parseFloat(setting.amount);
      }
      return acc;
    }, 0);

    const usedBudget = Object.values(categoryTotals).reduce(
      (acc, num) => acc + num,
      0
    );
    categoryTotals["remaining"] = totalBudget - usedBudget - totalSavingGoals;
    return categoryTotals;
  };

  return {
    calculateSavingGoalsTotal,
    calculateAnnualSavingGoalsTotal,
    calculateCategoryTotals,
  };
};
