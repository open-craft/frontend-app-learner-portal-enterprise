import React, {
  createContext, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';
import { Container } from '@openedx/paragon';

import { LoadingSpinner } from '../loading-spinner';
import {
  useCouponCodes,
  useSubscriptions,
  useRedeemableLearnerCreditPolicies,
} from './data/hooks';
import { useEnterpriseOffers } from './enterprise-offers/data/hooks';
import { LOADING_SCREEN_READER_TEXT } from './data/constants';

export const UserSubsidyContext = createContext();

const UserSubsidy = ({ children }) => {
  const { enterpriseConfig, authenticatedUser } = useContext(AppContext);

  // Hack to avoid "No License" issue when the user does SSO Registration+login and
  // visits with a cookie without roles.
  // The LoginRefresh component is supposed to handle this scenario. But somehow it
  // doesn't seem to. Tried called `fetchAuthenticatedUser()` after the LoginRefresh
  // in a number of places from components to hooks - everytime, it left the app in
  // the "loading..." state. It is probably because calling fetchAuthenticatedUser
  // destroys the `authenticatedUser` object and replaces it with another one and
  // somewhere in the app, it doesn't trigger rerender becuase it's not being tracked
  // correctly.
  //
  // Don't have the time to debug the full app and just pushing out this hack as a
  // workaround for now.
  if (!!authenticatedUser.activationKey && (authenticatedUser.roles.length === 0)) {
    window.location.reload();
  }

  const { userId } = authenticatedUser;
  // Subscriptions
  const {
    customerAgreementConfig,
    subscriptionPlan,
    subscriptionLicense,
    isLoading: isLoadingSubscriptions,
    showExpirationNotifications,
    activateUserLicense,
  } = useSubscriptions({ enterpriseConfig, authenticatedUser });

  // Subsidy Access Policies
  const {
    data: redeemableLearnerCreditPolicies,
    isLoading: isLoadingRedeemablePolicies,
  } = useRedeemableLearnerCreditPolicies(enterpriseConfig.uuid, userId);

  // Coupon Codes
  const [couponCodes, isLoadingCouponCodes] = useCouponCodes(enterpriseConfig.uuid);

  // Enterprise Offers
  const {
    enterpriseOffers,
    canEnrollWithEnterpriseOffers,
    hasLowEnterpriseOffersBalance,
    hasNoEnterpriseOffersBalance,
    isLoading: isLoadingEnterpriseOffers,
  } = useEnterpriseOffers({
    enterpriseId: enterpriseConfig.uuid,
    enableLearnerPortalOffers: enterpriseConfig.enableLearnerPortalOffers,
    customerAgreementConfig,
  });

  const isLoadingSubsidies = useMemo(
    () => {
      const loadingStates = [
        isLoadingSubscriptions,
        isLoadingCouponCodes,
        isLoadingEnterpriseOffers,
        isLoadingRedeemablePolicies,
      ];
      return loadingStates.includes(true);
    },
    [isLoadingSubscriptions, isLoadingCouponCodes, isLoadingEnterpriseOffers, isLoadingRedeemablePolicies],
  );

  const contextValue = useMemo(
    () => {
      if (isLoadingSubsidies) {
        return {};
      }
      return {
        subscriptionLicense,
        subscriptionPlan,
        couponCodes,
        enterpriseOffers,
        canEnrollWithEnterpriseOffers,
        hasLowEnterpriseOffersBalance,
        hasNoEnterpriseOffersBalance,
        showExpirationNotifications,
        customerAgreementConfig,
        activateUserLicense,
        redeemableLearnerCreditPolicies,
      };
    },
    [
      isLoadingSubsidies,
      subscriptionLicense,
      subscriptionPlan,
      couponCodes,
      enterpriseOffers,
      canEnrollWithEnterpriseOffers,
      hasLowEnterpriseOffersBalance,
      hasNoEnterpriseOffersBalance,
      showExpirationNotifications,
      customerAgreementConfig,
      activateUserLicense,
      redeemableLearnerCreditPolicies,
    ],
  );

  if (isLoadingSubsidies) {
    return (
      <Container className="py-5">
        <LoadingSpinner screenReaderText={LOADING_SCREEN_READER_TEXT} />
      </Container>
    );
  }
  return (
    <>
      {/* Render the children so the rest of the page shows */}
      <UserSubsidyContext.Provider value={contextValue}>
        {children}
      </UserSubsidyContext.Provider>
    </>
  );
};

UserSubsidy.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserSubsidy;
