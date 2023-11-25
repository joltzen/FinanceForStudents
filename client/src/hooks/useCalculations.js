/* Copyright (c) 2023, Jason Oltzen */

export const useCalculations = (
  transactions,
  settings,
  savingsGoals,
  filterMonth,
  filterYear,
  totalSavingGoals,
  isAnnualView,
  prevMonthTransactions,
  prevSettings,
  allTransactions,
  allSettings,
  allSaving
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
      if (transaction.transaction_type === "Einnahme")
        categoryTotals[transaction.category_id] += parseFloat(
          transaction.amount
        );
      else
        categoryTotals[transaction.category_id] -= parseFloat(
          transaction.amount
        );
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

    categoryTotals["remaining"] = totalBudget + usedBudget - totalSavingGoals;
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

  const calcMonthlyExpense = () => {
    let monthlyExpenses = new Array(12).fill(0);

    transactions.forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (year === filterYear) {
        if (transaction.transaction_type === "Ausgabe") {
          monthlyExpenses[month] -= parseFloat(transaction.amount);
        }
        if (transaction.transaction_type === "Einnahme") {
          monthlyExpenses[month] += parseFloat(transaction.amount);
        }
      }
    });
    return monthlyExpenses[filterMonth - 1];
  };
  const cmr = () => {
    let monthlyBudgets = new Array(12).fill(0);
    let monthlyExpenses = new Array(12).fill(0);
    let monthlySavings = new Array(12).fill(0);

    transactions.forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (year === filterYear) {
        if (transaction.transaction_type === "Einnahme") {
          monthlyBudgets[month] += parseFloat(transaction.amount);
        } else if (transaction.transaction_type === "Ausgabe") {
          monthlyExpenses[month] -= parseFloat(transaction.amount);
        }
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
      const start = new Date(goal.startdate);
      const end = goal.deadline
        ? new Date(goal.deadline)
        : new Date(start.getFullYear(), 11, 31);

      for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
        const startMonth = year === start.getFullYear() ? start.getMonth() : 0;
        const endMonth = year === end.getFullYear() ? end.getMonth() : 11;

        for (let month = startMonth; month <= endMonth; month++) {
          if (year === filterYear) {
            monthlySavings[month] += parseFloat(goal.monthly_saving);
          }
        }
      }
    });

    let monthlyRemainingBudgets = monthlyBudgets.map((budget, index) => {
      if (monthlyExpenses[index] > 0) {
        return budget - monthlyExpenses[index] - monthlySavings[index];
      } else {
        return budget + monthlyExpenses[index] - monthlySavings[index];
      }
    });
    return monthlyRemainingBudgets;
  };
  const calculateMonthlyRemainingBudgets = () => {
    let monthlyBudgets = new Array(12).fill(0);
    let monthlyExpenses = new Array(12).fill(0);
    let monthlySavings = new Array(12).fill(0);

    monthlyExpenses[filterMonth - 1] = transactions.reduce(
      (acc, transaction) => {
        if (transaction.transaction_type === "Einnahme") {
          return acc + parseFloat(transaction.amount);
        } else if (transaction.transaction_type === "Ausgabe") {
          return acc - parseFloat(transaction.amount);
        }
        return acc;
      },
      0
    );

    settings?.forEach((setting) => {
      if (setting.transaction_type === "Einnahme") {
        monthlyBudgets[setting.month - 1] += parseFloat(setting.amount);
      } else if (setting.transaction_type === "Ausgabe") {
        monthlyBudgets[setting.month - 1] -= parseFloat(setting.amount);
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

  const calculatePreviousMonthRemainingBudget = () => {
    // Determine the previous month and year
    const previousMonth = filterMonth === 0 ? 11 : filterMonth - 1;
    const previousYear = filterMonth === 0 ? filterYear - 1 : filterYear;
    var monthlyBudget = 0;
    var monthlyExpenses = 0;
    var monthlySavings = 0;

    // Calculate expenses for the previous month
    prevMonthTransactions.forEach((transaction) => {
      if (transaction.transaction_type === "Einnahme") {
        monthlyExpenses += parseFloat(transaction.amount);
      } else if (transaction.transaction_type === "Ausgabe") {
        monthlyExpenses -= parseFloat(transaction.amount);
      }
    }, 0);

    // Calculate budget and savings for the previous month
    prevSettings?.forEach((setting) => {
      const settingMonth = setting.month; // Adjust for zero-indexed months
      if (settingMonth === previousMonth && setting.year === previousYear) {
        if (setting.transaction_type === "Einnahme") {
          monthlyBudget += parseFloat(setting.amount);
        } else if (setting.transaction_type === "Ausgabe") {
          monthlyBudget -= parseFloat(setting.amount);
        }
      }
    });

    // Calculate savings for the previous month
    savingsGoals?.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth();
      const startYear = new Date(goal.startdate).getFullYear();
      const endMonth = goal.deadline ? new Date(goal.deadline).getMonth() : 11;
      const endYear = goal.deadline
        ? new Date(goal.deadline).getFullYear()
        : previousYear;

      if (
        (previousYear > startYear ||
          (previousYear === startYear && previousMonth >= startMonth)) &&
        (previousYear < endYear ||
          (previousYear === endYear && previousMonth <= endMonth))
      ) {
        monthlySavings += parseFloat(goal.monthly_saving);
      }
    });

    // Calculate remaining budget for the previous month
    let previousMonthRemainingBudget =
      monthlyBudget + monthlyExpenses - monthlySavings;

    return previousMonthRemainingBudget;
  };

  //I want to calculate the percentage  of the remaining budget for  the given month and the one before
  const calculateMonthlySavingsDifference = () => {
    var previousMonthRemainingBudget = calculatePreviousMonthRemainingBudget();
    var thisMonthRemainingBudget = calculateMonthlyRemainingBudgets().filter(
      (budget) => budget !== 0
    )[0];

    if (thisMonthRemainingBudget === undefined) {
      thisMonthRemainingBudget = 0;
    }
    if (previousMonthRemainingBudget === undefined) {
      previousMonthRemainingBudget = 0;
    }

    if (previousMonthRemainingBudget === 0 && thisMonthRemainingBudget > 0) {
      return 100;
    } else if (
      previousMonthRemainingBudget === 0 &&
      thisMonthRemainingBudget < 0
    ) {
      return -100;
    } else if (
      thisMonthRemainingBudget === 0 &&
      previousMonthRemainingBudget === 0
    ) {
      return 0;
    }

    const percentageDifference =
      ((thisMonthRemainingBudget - previousMonthRemainingBudget) /
        Math.abs(previousMonthRemainingBudget)) *
      100;
    return percentageDifference;
  };

  const calculateTotalSavings = () => {
    let totalSavingsFromTransactions = 0;
    let totalSavingsFromGoals = 0;
    let totalSavingsFromSettings = 0;

    // Sum up savings from all transactions
    allTransactions.forEach((transaction) => {
      if (transaction.transaction_type === "Einnahme") {
        totalSavingsFromTransactions += parseFloat(transaction.amount);
      } else if (transaction.transaction_type === "Ausgabe") {
        totalSavingsFromTransactions -= parseFloat(transaction.amount);
      }
    });

    savingsGoals.forEach((goal) => {
      const startMonth = new Date(goal.startdate).getMonth() + 1;
      const startYear = new Date(goal.startdate).getFullYear();
      let deadlineMonth = new Date(goal.deadline).getMonth() + 1;
      const deadlineYear = new Date(goal.deadline).getFullYear();

      // Check if the current month/year matches the deadline month/year
      if (filterYear === deadlineYear && filterMonth === deadlineMonth) {
        deadlineMonth--; // Decrement the deadline month so it's not included
      }

      const isWithinRange =
        (filterYear > startYear ||
          (filterYear === startYear && filterMonth >= startMonth)) &&
        (filterYear < deadlineYear ||
          (filterYear === deadlineYear && filterMonth < deadlineMonth));

      if (isWithinRange) {
        totalSavingsFromGoals += parseFloat(goal.monthly_saving);
      }
    });
    // Sum up savings from all settingsa
    allSettings.forEach((setting) => {
      if (setting.transaction_type === "Einnahme") {
        totalSavingsFromSettings += parseFloat(setting.amount);
      } else if (setting.transaction_type === "Ausgabe") {
        totalSavingsFromSettings -= parseFloat(setting.amount);
      }
    });

    // Calculate total savings
    const totalSavings =
      totalSavingsFromTransactions +
      totalSavingsFromSettings -
      totalSavingsFromGoals;

    return totalSavings;
  };

  return {
    calculateCategoryTotals,
    totalSavings,
    calculateAnnualTotals,
    getCategoryTotal,
    getAnnualCategoryTotal,
    calculateMonthlyRemainingBudgets,
    calculateMonthlySavingsDifference,
    calcMonthlyExpense,
    calculateSavingGoalsTotal,
    calculateTotalSavings,
    cmr,
  };
};
