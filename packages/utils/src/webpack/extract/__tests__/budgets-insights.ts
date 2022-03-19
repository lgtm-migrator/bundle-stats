import extractBudgetsInsights from '../budgets-insights';

describe('Webpack/extracts/extractBudgetsInsights', () => {
  test('should return empty insights when no budgets options', () => {
    const actual = extractBudgetsInsights(
      undefined,
      {
        metrics: { totalSizeByTypeALL: { value: 10000 } },
      },
      undefined,
      {},
    );

    expect(actual).toEqual(null);
  });

  test('should return budgets insights', () => {
    const actual = extractBudgetsInsights(
      undefined,
      {
        metrics: { totalSizeByTypeALL: { value: 11776 } },
      },
      undefined,
      {
        budgets: [
          {
            metric: 'totalSizeByTypeALL',
            value: 10240,
          },
        ],
      },
    );

    expect(actual).toEqual({
      insights: {
        budgets: {
          totalSizeByTypeALL: {
            value: 11776,
            budget: 10240,
            overBudget: true,
          },
        },
      },
    });
  });

  test('should return budgets insights for sizes', () => {
    const actual = extractBudgetsInsights(
      undefined,
      {
        metrics: { sizes: { totalSizeByTypeJS: { value: 11776 } } },
      },
      undefined,
      {
        budgets: [
          {
            metric: 'sizes.totalSizeByTypeJS',
            value: 10240,
          },
        ],
      },
    );

    expect(actual).toEqual({
      insights: {
        budgets: {
          'sizes.totalSizeByTypeJS': {
            value: 11776,
            budget: 10240,
            overBudget: true,
          },
        },
      },
    });
  });
});
