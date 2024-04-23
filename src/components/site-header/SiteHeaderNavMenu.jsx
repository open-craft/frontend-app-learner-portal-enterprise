import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';

const SiteHeaderNavMenu = () => {
  const { enterpriseConfig } = useContext(AppContext);
  const mainMenuLinkClassName = 'nav-link';

  if (enterpriseConfig.disableSearch) {
    return null;
  }

  return (
    <NavLink to={`/${enterpriseConfig.slug}/search`} className={mainMenuLinkClassName} exact>
      Explore
    </NavLink>
  );
};

export default SiteHeaderNavMenu;
