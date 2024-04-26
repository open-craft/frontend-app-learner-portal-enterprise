import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Button, breakpoints, MediaQuery,
} from '@edx/paragon';
import PropTypes from 'prop-types';

import { CourseEnrollments } from './course-enrollments';

import SupportInformation from '../sidebar/SupportInformation';
import SubsidiesSummary from '../sidebar/SubsidiesSummary';
import CourseRecommendations from './CourseRecommendations';

import CourseSearchIcon from '../../../assets/icons/course-search-icon.svg';

const DashboardMainContent = ({ canOnlyViewHighlightSets }) => {
  const {
    enterpriseConfig: {
      name,
      slug,
      disableSearch,
    },
  } = useContext(AppContext);
  return (
    <>
      {/*
      <MediaQuery maxWidth={breakpoints.medium.maxWidth}>
        {matches => (matches ? (
          <SubsidiesSummary />
        ) : null)}
      </MediaQuery>
      */}
      <CourseEnrollments>
        {/* The children below will only be rendered if there are no course enrollments. */}
        <div className="text-center mt-6">
          <img src={CourseSearchIcon} alt="Search Courses Icon" />
          <h4 className="h3 my-5">Enroll in Learning Paths or Courses</h4>
          <p>
            <Button as={Link} to={`/${slug}/search`} variant="primary">Explore Now</Button>
          </p>
        </div>
      </CourseEnrollments>

      {/*
      <MediaQuery maxWidth={breakpoints.medium.maxWidth}>
        {matches => (matches ? <SupportInformation className="mt-5" /> : null)}
      </MediaQuery>
      */}
    </>
  );
};

DashboardMainContent.propTypes = {
  canOnlyViewHighlightSets: PropTypes.bool,
};

DashboardMainContent.defaultProps = {
  canOnlyViewHighlightSets: false,
};

export default DashboardMainContent;
