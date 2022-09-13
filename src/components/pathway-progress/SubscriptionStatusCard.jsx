import React, { useContext } from 'react';
import { Card, Badge } from '@edx/paragon';

import { UserSubsidyContext } from '../enterprise-user-subsidy';
import { LICENSE_STATUS } from '../enterprise-user-subsidy/data/constants';
import { SubsidyRequestsContext, SUBSIDY_TYPE } from '../enterprise-subsidy-requests';

function SubscriptionStatusCard() {
  const {
    subscriptionPlan,
    subscriptionLicense: userSubscriptionLicense,
  } = useContext(UserSubsidyContext);
  const expirationDate = subscriptionPlan?.expirationDate;

  const {
    requestsBySubsidyType,
  } = useContext(SubsidyRequestsContext);

  const licenseRequests = requestsBySubsidyType[SUBSIDY_TYPE.LICENSE];
  const hasActiveLicenseOrLicenseRequest = (subscriptionPlan
    && userSubscriptionLicense?.status === LICENSE_STATUS.ACTIVATED) || licenseRequests.length > 0;

  return (
    <div className="row-cols-3 subscription-status-card">
      <Card className="w-40">
        <Card.Section
          className="d-flex flex-column align-items-left justify-content-between"
        >
          <div className="h4 mb-0">
            <span>Subscription Status</span>&nbsp; &nbsp;
            <Badge variant={hasActiveLicenseOrLicenseRequest ? 'success' : 'danger'}>{hasActiveLicenseOrLicenseRequest ? 'Active' : 'Not Active'}</Badge>
          </div>
          {
            expirationDate && <div className="subscription-expiry">Available Until {expirationDate}</div>
          }
        </Card.Section>
      </Card>
    </div>
  );
}

export default SubscriptionStatusCard;