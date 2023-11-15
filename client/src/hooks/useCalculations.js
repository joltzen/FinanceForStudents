// useCalculations.js
export const useCalculations = (
  transactions,
  settings,
  savingsGoals,
  filterMonth,
  filterYear,
  totalSavingGoals,
  isAnnualView
) => {
  const calculateSavingGoalsTotal = () => {
    let totalSavings = 0;

    savingsGoals.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth() + 1;
      const startYear = new Date(goal.startdate).getFullYear();
      const deadlineMonth = new Date(goal.deadline).getMonth() + 1;
      const deadlineYear = new Date(goal.deadline).getFullYear();

      const isWithinRange =
        (filterYear > startYear ||
          (filterYear === startYear && filterMonth >= startMonth)) &&
        (filterYear < deadlineYear ||
          (filterYear === deadlineYear && filterMonth < deadlineMonth));

      if (isWithinRange) {
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
        : new Date(goalStart.getFullYear() + 1, 0, 1);

      const startMonth =
        goalStart.getFullYear() === filterYear ? goalStart.getMonth() + 1 : 1;
      const endMonth =
        goalEnd.getFullYear() === filterYear ? goalEnd.getMonth() + 1 : 12;

      if (
        filterYear >= goalStart.getFullYear() &&
        filterYear <= goalEnd.getFullYear()
      ) {
        let monthsInYear = endMonth - startMonth;
        if (
          goalStart.getFullYear() === goalEnd.getFullYear() &&
          goalStart.getMonth() === goalEnd.getMonth()
        ) {
          monthsInYear -= 1;
        }

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

  const calculateAnnualTotals = () => {
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
  const totalSavings = isAnnualView
    ? calculateAnnualSavingGoalsTotal()
    : calculateSavingGoalsTotal();

  const getCategoryTotal = (categoryId) => {
    const totals = calculateCategoryTotals();
    return totals[categoryId] || 0;
  };

  const getAnnualCategoryTotal = (categoryId) => {
    const totals = calculateCategoryTotals();
    return totals[categoryId] || 0;
  };

  const calculateMonthlyRemainingBudgets = () => {
    let monthlyBudgets = new Array(12).fill(0);
    let monthlyExpenses = new Array(12).fill(0);
    let monthlySavings = new Array(12).fill(0);

    transactions.forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (year === filterYear) {
        monthlyExpenses[month] += parseFloat(transaction.amount);
      }
    });

    settings?.forEach((setting) => {
      if (setting.transaction_type === "Einnahme") {
        monthlyBudgets[setting.month - 1] += parseFloat(setting.amount);
      } else if (setting.transaction_type === "Ausgabe") {
        monthlyBudgets[setting.month - 1] -= parseFloat(setting.amount);
      }
    });

    transactions?.forEach((transaction) => {
      if (transaction.transaction_type === "Einnahme") {
        monthlyBudgets[transaction.month - 1] += parseFloat(transaction.amount);
      } else if (transaction.transaction_type === "Ausgabe") {
        monthlyExpenses[transaction.month - 1] -= parseFloat(
          transaction.amount
        );
      }
    });
    savingsGoals?.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth();
      const endMonth = goal.deadline ? new Date(goal.deadline).getMonth() : 11;
      for (let month = startMonth; month <= endMonth; month++) {
        monthlySavings[month] += parseFloat(goal.monthly_saving);
      }
    });

    let monthlyRemainingBudgets = monthlyBudgets.map((budget, index) => {
      return budget - monthlyExpenses[index] - monthlySavings[index];
    });

    return monthlyRemainingBudgets;
  };
  return {
    calculateCategoryTotals,
    totalSavings,
    calculateAnnualTotals,
    getCategoryTotal,
    getAnnualCategoryTotal,
    calculateMonthlyRemainingBudgets,
  };
};
