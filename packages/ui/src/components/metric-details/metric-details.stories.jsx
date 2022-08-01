import React from 'react';

import { MetricDetails } from '.';

export default {
  title: 'Components/MetricDetails',
  component: MetricDetails,
  args: {
    loading: false,
  },
};

const Template = (props) => <MetricDetails {...props} />;

export const Default = Template.bind();

Default.args = {
  title: 'Bundle size',
  value: '100',
};

export const WithDelta = Template.bind();

WithDelta.args = {
  title: 'Bundle size',
  value: '100',
  delta: '+20%',
  deltaType: 'HIGH_POSITIVE',
};

export const WithBaseline = Template.bind();

WithBaseline.args = {
  title: 'Bundle size',
  value: '100',
  delta: '25%',
  baseline: '80',
};

export const WithUnit = Template.bind();

WithUnit.args = {
  title: 'Bundle size',
  value: '100',
  unit: 'MB',
  delta: '25%',
  baseline: '80MB',
};
