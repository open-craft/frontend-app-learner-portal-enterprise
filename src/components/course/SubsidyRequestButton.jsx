import React, {
  useContext, useMemo, useState, useCallback,
} from 'react';
import { StatefulButton } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';

import { SubsidyRequestsContext, SUBSIDY_TYPE } from '../enterprise-subsidy-requests';
import { CourseContext } from './CourseContextProvider';
import { useUserHasSubsidyRequestForCourse } from './data/hooks';
import { findUserEnrollmentForCourseRun } from './data/utils';
import { ToastsContext } from '../Toasts';
import { postLicenseRequest, postCouponCodeRequest } from '../enterprise-subsidy-requests/data/service';

const props = {
  labels: {
    request: 'Request enrollment',
    pending: 'Requesting',
    requested: 'Awaiting approval',
  },
  disabledStates: ['requested'],
  variant: 'outline-primary',
  className: 'mb-4 mt-1',
};

const SubsidyRequestButton = () => {
  const { addToast } = useContext(ToastsContext);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const {
    subsidyRequestConfiguration,
    refreshSubsidyRequests,
  } = useContext(SubsidyRequestsContext);

  const { state, subsidyRequestCatalogsApplicableToCourse, userSubsidyApplicableToCourse } = useContext(CourseContext);

  const { course, userEnrollments } = state;
  const {
    key: courseKey,
    courseRunKeys,
  } = course;

  /**
   * Check every course run to see if user is enrolled in any of them
   */
  const isUserEnrolled = useMemo(
    () => {
      if (courseRunKeys) {
        const enrollments = courseRunKeys.filter(
          (key) => findUserEnrollmentForCourseRun({ userEnrollments, key }),
        );
        return enrollments.length > 0;
      }
      return false;
    },
    [courseRunKeys, userEnrollments],
  );

  const userHasSubsidyRequest = useUserHasSubsidyRequestForCourse(courseKey);

  const requestSubsidy = useCallback(async (key) => {
    switch (subsidyRequestConfiguration.subsidyType) {
      case SUBSIDY_TYPE.LICENSE:
        return postLicenseRequest(subsidyRequestConfiguration.enterpriseCustomerUuid, key);
      case SUBSIDY_TYPE.COUPON:
        return postCouponCodeRequest(subsidyRequestConfiguration.enterpriseCustomerUuid, key);
      default:
        throw new Error('Subsidy request configuration not set');
    }
  }, [subsidyRequestConfiguration]);

  /**
   * Show subsidy request button if:
   *  - subsidy requests is enabled
   *  - user is not already enrolled in the course
   *  - user has no applicable subsidy for the course
   *  AND
   *    - user has a subsidy request for the course
   *      OR
   *    - course is in catalog
   *
   * An applicable subsidy (e.g. an auto-applied license that reaches the browser after a
   * request was already submitted) always wins over a pending request. Without the explicit
   * `!userSubsidyApplicableToCourse` guard, a stale `userHasSubsidyRequest` would keep the
   * button latched on "Awaiting approval" even once the learner has a usable subsidy and the
   * normal "Enroll" CTA is available.
   */
  const hasSubsidyRequestsEnabled = subsidyRequestConfiguration?.subsidyRequestsEnabled;
  const showSubsidyRequestButton = hasSubsidyRequestsEnabled
    && !isUserEnrolled
    && !userSubsidyApplicableToCourse
    && (userHasSubsidyRequest || subsidyRequestCatalogsApplicableToCourse.size > 0);

  if (!showSubsidyRequestButton) {
    return null;
  }

  /**
   * @returns {string} one of `request`, `pending`, or `requested`
   */
  const getButtonState = () => {
    if (loadingRequest) {
      return 'pending';
    } if (userHasSubsidyRequest) {
      return 'requested';
    }
    return 'request';
  };

  const handleRequestButtonClick = async () => {
    setLoadingRequest(true);
    try {
      await requestSubsidy(courseKey);
      setLoadingRequest(false);
      addToast('Request for course submitted');
      refreshSubsidyRequests();
    } catch (error) {
      logError(error);
      setLoadingRequest(false);
    }
  };

  return (
    <div>
      <StatefulButton {...props} state={getButtonState()} onClick={handleRequestButtonClick} />
    </div>
  );
};

export default SubsidyRequestButton;
