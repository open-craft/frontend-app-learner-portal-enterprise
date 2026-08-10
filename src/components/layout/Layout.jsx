import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FooterSlot } from '@edx/frontend-component-footer';
import { AppContext } from '@edx/frontend-platform/react';

import { SystemWideWarningBanner } from '../system-wide-banner';
import Header from '@edx/frontend-component-header';
import { useStylesForCustomBrandColors } from './data/hooks';

export const TITLE_TEMPLATE = '%s - edX';
export const DEFAULT_TITLE = 'edX';

const Layout = ({ children }) => {
  const { config, enterpriseConfig } = useContext(AppContext);
  const brandStyles = useStylesForCustomBrandColors(enterpriseConfig);

  const isMaintenanceAlertOpen = useMemo(() => {
    if (!config) {
      return false;
    }
    const isEnabledWithMessage = (
      config.IS_MAINTENANCE_ALERT_ENABLED && config.MAINTENANCE_ALERT_MESSAGE
    );
    if (!isEnabledWithMessage) {
      return false;
    }
    const startTimestamp = config.MAINTENANCE_ALERT_START_TIMESTAMP;
    if (startTimestamp) {
      return new Date() > new Date(startTimestamp);
    }
    return true;
  }, [config]);

  return (
    <>
      <Helmet titleTemplate={TITLE_TEMPLATE} defaultTitle={DEFAULT_TITLE}>
        <html lang="en" />
        {brandStyles.map(({ key, styles }) => (
          <style key={key} type="text/css">{styles}</style>
        ))}
      </Helmet>
      {isMaintenanceAlertOpen && (
        <SystemWideWarningBanner>
          {config.MAINTENANCE_ALERT_MESSAGE}
        </SystemWideWarningBanner>
      )}
      <Header />
      <main id="content" className="fill-vertical-space">
        {children}
      </main>
      <FooterSlot />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
