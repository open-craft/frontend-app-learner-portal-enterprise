import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  fetchAuthenticatedUser,
  hydrateAuthenticatedUser,
} from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
import { Container } from '@edx/paragon';

import { LoadingSpinner } from '../loading-spinner';
import { loginRefresh } from '../../utils/common';

const LoginRefresh = ({ children }) => {
  const { authenticatedUser } = useContext(AppContext);
  const { roles } = authenticatedUser;

  // If the user has not refreshed their JWT since they created their account,
  // we should refresh it so that they'll have appropriate roles (if available),
  // and thus, have any appropriate permissions when making downstream requests.
  const [isRefreshingJWT, setIsRefreshingJWT] = useState(roles.length === 0);

  useEffect(() => {
    const refreshJWT = async () => {
      await loginRefresh();
      // Refreshing the JWT only replaces the cookie; the in-memory `authenticatedUser`
      // (snapshotted into AppContext at app init) still carries the pre-refresh roles,
      // so consumers like the enterprise_learner check that gates license auto-apply
      // would read stale roles for the rest of the session.
      //
      // `fetchAuthenticatedUser()` re-decodes the refreshed cookie, but (a) it does not
      // emit AUTHENTICATED_USER_CHANGED, so AppProvider would never propagate the new
      // user into AppContext, and (b) it replaces the user object outright, dropping
      // account fields (e.g. `profileImage`) that `hydrateAuthenticatedUser()` may have
      // already merged — EnterprisePage blocks on `profileImage`, so dropping it hangs
      // the app on its loading screen. Re-hydrating merges those fields back onto the
      // freshly-decoded user AND emits AUTHENTICATED_USER_CHANGED.
      await fetchAuthenticatedUser();
      await hydrateAuthenticatedUser();
      setIsRefreshingJWT(false);
    };
    if (isRefreshingJWT) {
      refreshJWT();
    }
  }, [isRefreshingJWT]);

  if (isRefreshingJWT) {
    return (
      <Container size="lg" className="py-5">
        <LoadingSpinner screenReaderText="loading user details" />
      </Container>
    );
  }

  return children;
};

LoginRefresh.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginRefresh;
