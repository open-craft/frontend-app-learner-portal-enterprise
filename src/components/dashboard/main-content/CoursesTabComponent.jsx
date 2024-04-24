import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  useToggle,
  Alert,
  MediaQuery,
  breakpoints,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import { CourseEnrollmentsContextProvider } from './course-enrollments';
import { MainContent, Sidebar } from '../../layout';
import CourseEnrollmentFailedAlert, { ENROLLMENT_SOURCE } from '../../course/CourseEnrollmentFailedAlert';
import DashboardMainContent from './DashboardMainContent';
import { DashboardSidebar } from '../sidebar';
import { LICENSE_ACTIVATION_MESSAGE } from '../data/constants';

const CoursesTabComponent = ({ canOnlyViewHighlightSets }) => {
  const { state } = useLocation();
  const [isActivationAlertOpen, , closeActivationAlert] = useToggle(!!state?.activationSuccess);
  return (
    <CourseEnrollmentsContextProvider>
      <>
        <Alert
          variant="success"
          show={isActivationAlertOpen}
          onClose={closeActivationAlert}
          className="mt-3"
          dismissible
        >
          {LICENSE_ACTIVATION_MESSAGE}
        </Alert>

        <CourseEnrollmentFailedAlert className="mt-0 mb-3" enrollmentSource={ENROLLMENT_SOURCE.DASHBOARD} />
        <DashboardMainContent canOnlyViewHighlightSets={canOnlyViewHighlightSets} />
      </>
    </CourseEnrollmentsContextProvider>
  );
};

CoursesTabComponent.propTypes = {
  canOnlyViewHighlightSets: PropTypes.bool,
};

CoursesTabComponent.defaultProps = {
  canOnlyViewHighlightSets: false,
};

export default CoursesTabComponent;
