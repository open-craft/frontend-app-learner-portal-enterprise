import React, { useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import edXLogo from '@edx/brand/logo.svg';
import { Stack } from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform/config';
import { AppContext } from '@edx/frontend-platform/react';
import { COURSE_TYPE_PARTNER_LOGOS } from '../course/data/constants';

const SiteHeaderLogos = () => {
  const courseTypeMatch = useRouteMatch('/:enterpriseSlug/:courseType');
  const courseType = courseTypeMatch?.params?.courseType;
  const { enterpriseConfig } = useContext(AppContext);
  const courseTypePartnerLogo = courseType && COURSE_TYPE_PARTNER_LOGOS[courseType];
  const { LMS_BASE_URL } = getConfig();

  let mainLogo = (
    <img
      className="logo"
      src={enterpriseConfig.branding.logo || edXLogo}
      alt={`${enterpriseConfig.name} logo`}
      data-testid="header-logo-image-id"
    />
  );

  if (!enterpriseConfig.disableSearch) {
    mainLogo = (
      <a href={`${LMS_BASE_URL}/dashboard`} data-testid="header-logo-link-id">
        {mainLogo}
      </a>
    );
  }

  return (
    <Stack direction="horizontal" gap={3} className="mr-md-3">
      {mainLogo}
      {courseTypePartnerLogo && (
        <>
          <div className="vertical-divider" />
          <img
            className="logo"
            src={courseTypePartnerLogo}
            alt="partner-header-logo"
            data-testid="partner-header-logo-image-id"
          />
        </>
      )}
    </Stack>
  );
};

export default SiteHeaderLogos;
