import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  fetchAuthenticatedUser,
  getAuthenticatedUser,
  setAuthenticatedUser,
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
      // (snapshotted into AppContext at app init) still carries the pre-refresh roles.
      // Re-decode the refreshed cookie, then publish the change through the
      // interface-level `setAuthenticatedUser`, which emits AUTHENTICATED_USER_CHANGED
      // so AppProvider updates AppContext. `fetchAuthenticatedUser()` alone does NOT
      // emit that event — it updates the auth service's internal state only, leaving
      // every AppContext consumer (e.g. the enterprise_learner role check that gates
      // license auto-apply) reading stale roles for the rest of the session.
      await fetchAuthenticatedUser();
      setAuthenticatedUser(getAuthenticatedUser());
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
