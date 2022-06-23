import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  PACKAGE_FILTERS,
  PACKAGES_SEPARATOR,
  PACKAGE_ID_SEPARATOR,
  getBundleModulesBySearch,
  getBundlePackagesByNameComponentLink,
} from '@bundle-stats/utils';

import config from '../../config.json';
import I18N from '../../i18n';
import { Stack } from '../../layout/stack';
import { FlexStack } from '../../layout/flex-stack';
import { EmptySet } from '../../ui/empty-set';
import { Filters } from '../../ui/filters';
import { HoverCard } from '../../ui/hover-card';
import { SortDropdown } from '../../ui/sort-dropdown';
import { Tag } from '../../ui/tag';
import { Toolbar } from '../../ui/toolbar';
import { FileName } from '../../ui/file-name';
import { ComponentLink } from '../component-link';
import { MetricsTable } from '../metrics-table';
import { MetricsTableSearch } from '../metrics-table-search';
import { MetricsTableOptions } from '../metrics-table-options';
import { MetricsTableTitle } from '../metrics-table-title';
import css from './bundle-packages.module.css';

const PackagePopoverContent = ({ name, fullName, path, duplicate, CustomComponentLink }) => {
  const fallbackPackagePath = `node_modules/${fullName.split(PACKAGES_SEPARATOR).join('/node_modules/')}`;
  const normalizedPackagePath = `${path || fallbackPackagePath}/`;
  const [normalizedName, packageId] = name.split(PACKAGE_ID_SEPARATOR);

  return (
    <Stack space="xsmall" className={css.packageHoverCard}>
      <Stack space="xxxsmall">
        <h3 className={css.packageHoverCardTitle}>
          {normalizedName}
          {packageId && (
            <span className={css.packageHoverCardTitleIndex}>
              {`${PACKAGE_ID_SEPARATOR}${packageId}`}
            </span>
          )}
        </h3>
        <p className={css.packageHoverCardPath}>
          <FileName className={css.packageHoverCardPathValue} name={normalizedPackagePath} />
        </p>
      </Stack>

      <ul className={css.packageHoverCardList}>
        <li className={css.packageHoverCardItem}>
          <a
            href={`https://www.npmjs.com/package/${normalizedName}`}
            target="_blank"
            rel="noreferrer"
          >
            npmjs.com
          </a>
        </li>
        <li className={css.packageHoverCardItem}>
          <a
            href={`https://bundlephobia.com/result?p=${normalizedName}`}
            target="_blank"
            rel="noreferrer"
          >
            bundlephobia.com
          </a>
        </li>
      </ul>

      <Stack space="xxxsmall" className={css.packageHoverCardActions}>
        {duplicate && (
          <div>
            <CustomComponentLink {...getBundlePackagesByNameComponentLink(normalizedName)}>
              View all duplicate instances
            </CustomComponentLink>
          </div>
        )}

        <CustomComponentLink {...getBundleModulesBySearch(normalizedPackagePath)}>
          Search modules by package path
        </CustomComponentLink>
      </Stack>
    </Stack>
  );
};

PackagePopoverContent.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string,
  fullName: PropTypes.string.isRequired,
  duplicate: PropTypes.bool.isRequired,
  CustomComponentLink: PropTypes.elementType.isRequired,
};

PackagePopoverContent.defaultProps = {
  path: '',
};

const PackageName = ({ packageName, path, showDuplicateFlag, row, CustomComponentLink }) => {
  const [showHoverCard, setHoverCard] = useState(false);
  const handleOnMouseEnter = useCallback(() => setHoverCard(true), [showHoverCard]);

  const label = useMemo(
    () => (
      <>
        {showDuplicateFlag && row.duplicate && (
          <Tag
            className={css.packageNameTagDuplicate}
            title="Duplicate package"
            kind={Tag.KINDS.DANGER}
            size={Tag.SIZES.SMALL}
          />
        )}
        <span className={css.packageNameLabel}>{packageName}</span>
      </>
    ),
    [packageName, showDuplicateFlag, row],
  );

  if (!showHoverCard) {
    return (
      <span className={css.packageName} onMouseEnter={handleOnMouseEnter}>
        {label}
      </span>
    );
  }

  return (
    <HoverCard className={css.packageName} label={<span className={css.packageName}>{label}</span>}>
      <PackagePopoverContent
        name={packageName}
        path={path}
        fullName={row.label}
        duplicate={row.duplicate}
        CustomComponentLink={CustomComponentLink}
      />
    </HoverCard>
  );
};

PackageName.propTypes = {
  packageName: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  showDuplicateFlag: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    label: PropTypes.string,
    duplicate: PropTypes.bool,
    runs: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  CustomComponentLink: PropTypes.elementType.isRequired,
};

const RowHeader = ({ row, CustomComponentLink }) => {
  const packageNames = row.label.split(PACKAGES_SEPARATOR);
  const { path } = row.runs[0] || {};

  return (
    <span className={css.packageNames}>
      {packageNames.map((packageName, index) => (
        <PackageName
          packageName={packageName}
          path={path}
          // Render duplicate flag only for the last entry
          showDuplicateFlag={index === packageNames.length - 1}
          row={row}
          CustomComponentLink={CustomComponentLink}
        />
      ))}
    </span>
  );
};

RowHeader.propTypes = {
  row: PropTypes.shape({
    label: PropTypes.string,
    duplicate: PropTypes.bool,
    runs: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  CustomComponentLink: PropTypes.elementType.isRequired,
};

export const BundlePackages = (props) => {
  const {
    className,
    jobs,
    items,
    updateFilters,
    resetFilters,
    resetAllFilters,
    totalRowCount,
    filters,
    sortFields,
    sort,
    updateSort,
    search,
    updateSearch,
    hasActiveFilters,
    customComponentLink: CustomComponentLink,
  } = props;

  const emptyMessage = (
    <EmptySet
      resources="packages"
      filtered={totalRowCount !== 0}
      handleResetFilters={resetFilters}
      handleViewAll={resetAllFilters}
    />
  );

  const renderRowHeader = useCallback(
    (row) => <RowHeader row={row} CustomComponentLink={CustomComponentLink} />,
    [CustomComponentLink],
  );

  return (
    <section className={cx(css.root, className)}>
      <Toolbar
        className={css.toolbar}
        renderActions={({ actionClassName }) => (
          <FlexStack space="xxsmall" className={cx(css.dropdown, actionClassName)}>
            <SortDropdown fields={sortFields} {...sort} onChange={updateSort} />
            <MetricsTableOptions
              handleViewAll={resetAllFilters}
              handleResetFilters={resetFilters}
            />
          </FlexStack>
        )}
      >
        <FlexStack space="xxsmall">
          <MetricsTableSearch
            className={css.toolbarSearch}
            placeholder="Search by name"
            search={search}
            updateSearch={updateSearch}
          />
          <Filters
            filters={{
              [PACKAGE_FILTERS.CHANGED]: {
                label: 'Changed',
                defaultValue: filters[PACKAGE_FILTERS.CHANGED],
                disabled: jobs.length <= 1,
              },
              [PACKAGE_FILTERS.DUPLICATE]: {
                label: 'Duplicate',
                defaultValue: filters[PACKAGE_FILTERS.DUPLICATE],
              },
            }}
            label={`Filters (${items.length}/${totalRowCount})`}
            onChange={updateFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </FlexStack>
      </Toolbar>
      <main>
        <MetricsTable
          runs={jobs}
          items={items}
          emptyMessage={emptyMessage}
          renderRowHeader={renderRowHeader}
          showHeaderSum
          title={
            <MetricsTableTitle
              title={I18N.PACKAGES}
              info={`(${items.length}/${totalRowCount})`}
              popoverInfo={I18N.PACKAGES_INFO}
              popoverHref={config.documentation.packages}
            />
          }
        />
      </main>
    </section>
  );
};

BundlePackages.defaultProps = {
  className: '',
  totalRowCount: 0,
  hasActiveFilters: false,
  customComponentLink: ComponentLink,
};

BundlePackages.propTypes = {
  className: PropTypes.string,
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      internalBuildNumber: PropTypes.number,
    }),
  ).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      runs: PropTypes.arrayOf(
        PropTypes.shape({
          displayValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          displayDelta: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
      ),
    }),
  ).isRequired,
  updateFilters: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  resetAllFilters: PropTypes.func.isRequired,
  totalRowCount: PropTypes.number,
  filters: PropTypes.shape({
    changed: PropTypes.bool,
  }).isRequired,
  hasActiveFilters: PropTypes.bool,
  sortFields: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      label: PropTypes.string,
      defaultDirection: PropTypes.bool,
    }),
  }).isRequired,
  sort: PropTypes.shape({
    sortBy: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  updateSort: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  updateSearch: PropTypes.func.isRequired,
  customComponentLink: PropTypes.elementType,
};
