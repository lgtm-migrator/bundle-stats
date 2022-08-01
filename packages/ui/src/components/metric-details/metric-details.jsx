import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Stack } from '../../layout/stack';
import { Skeleton } from '../../ui/skeleton';
import { Delta } from '../delta';
import css from './metric-details.module.css';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  loading: PropTypes.bool,
  title: PropTypes.string,
  value: PropTypes.string,
  unit: PropTypes.string,
  baseline: PropTypes.string,
  delta: PropTypes.string,
  deltaType: PropTypes.string,
};

const defaultProps = {
  className: '',
  as: 'div',
  loading: false,
  title: undefined,
  value: undefined,
  unit: undefined,
  baseline: undefined,
  delta: undefined,
  deltaType: undefined,
};

/**
 * @param {PropTypes.InferProps<typeof propTypes>} props
 * @returns {React.FunctionComponentElement}
 */
export const MetricDetails = (props) => {
  const {
    className,
    as: Component,
    loading,
    title,
    value,
    unit,
    delta,
    deltaType,
    baseline,
  } = props;

  const rootClassName = cx(css.root, className);

  if (loading) {
    return (
      <Stack space="xxxsmall" className={rootClassName}>
        <Skeleton as="h3" className={css.title} />
        <Skeleton as="span" className={css.value} />
        <Skeleton as="span" className={css.delta} />
        <Skeleton as="span" className={css.baseline} />
      </Stack>
    );
  }

  return (
    <Stack space="xxxsmall" className={rootClassName}>
      <h3 className={css.title}>{title}</h3>
      <span className={css.value}>{value}</span>
      <span className={css.unit}>{unit}</span>
      <Delta className={css.delta} displayValue={delta} deltaType={deltaType} />
      <span className={css.baseline}>{baseline}</span>
    </Stack>
  );
};

MetricDetails.propTypes = propTypes;
MetricDetails.defaultProps = defaultProps;
