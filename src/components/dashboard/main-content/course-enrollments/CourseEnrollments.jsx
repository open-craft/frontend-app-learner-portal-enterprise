import React, { useContext, useMemo, useState } from 'react';
import { MediaQuery, Stack, breakpoints } from '@openedx/paragon';

import PropTypes from 'prop-types';
import CourseSection from './CourseSection';

import CourseEnrollmentsAlert from './CourseEnrollmentsAlert';
import { CourseEnrollmentsContext } from './CourseEnrollmentsContextProvider';
import { sortedEnrollmentsByEnrollmentDate } from './data/utils';
import NewCourseCard from './course-cards/NewCourseCard';
import { MainContent, Sidebar } from '../../../layout';
import CourseEnrollmentsFilter from './CourseEnrollmentsFilter';
import CourseSearchIcon from '../../../../assets/icons/course-search-icon.svg';

export const COURSE_SECTION_TITLES = {
  current: 'In Progress',
  completed: 'Completed',
  savedForLater: 'Not Started',
};

const CourseEnrollments = ({ children }) => {
  const {
    courseEnrollmentsByStatus,
    fetchCourseEnrollmentsError,
    showMarkCourseCompleteSuccess,
    showMoveToInProgressCourseSuccess,
    setShowMarkCourseCompleteSuccess,
    setShowMoveToInProgressCourseSuccess,
  } = useContext(CourseEnrollmentsContext);

  const currentCourseEnrollments = useMemo(
    () => sortedEnrollmentsByEnrollmentDate(
      [
        ...courseEnrollmentsByStatus.inProgress,
        ...courseEnrollmentsByStatus.upcoming,
        ...courseEnrollmentsByStatus.requested,
      ],
    ),
    [
      courseEnrollmentsByStatus.inProgress,
      courseEnrollmentsByStatus.upcoming,
      courseEnrollmentsByStatus.requested,
    ],
  );

  const completedCourseEnrollments = useMemo(
    () => sortedEnrollmentsByEnrollmentDate(courseEnrollmentsByStatus.completed),
    [courseEnrollmentsByStatus.completed],
  );

  const savedForLaterCourseEnrollments = useMemo(
    () => sortedEnrollmentsByEnrollmentDate(courseEnrollmentsByStatus.savedForLater),
    [courseEnrollmentsByStatus.savedForLater],
  );

  const [currentGroup, setCurrentGroup] = useState(COURSE_SECTION_TITLES.current);
  const ENROLLMENT_MAP = {
    [COURSE_SECTION_TITLES.current]: currentCourseEnrollments,
    [COURSE_SECTION_TITLES.completed]: completedCourseEnrollments,
    [COURSE_SECTION_TITLES.savedForLater]: savedForLaterCourseEnrollments,
  };
  const NO_ENROLLMENT_MESSAGE = {
    [COURSE_SECTION_TITLES.current]: "You don't have any course that are currently in progress.",
    [COURSE_SECTION_TITLES.completed]: "You haven't completed any courses.",
    [COURSE_SECTION_TITLES.savedForLater]: "You don't have any courses saved for later.",
  };

  if (fetchCourseEnrollmentsError) {
    return (
      <CourseEnrollmentsAlert variant="danger">
        An error occurred while retrieving your course enrollments. Please try again.
      </CourseEnrollmentsAlert>
    );
  }

  const hasCourseEnrollments = Object.values(courseEnrollmentsByStatus).flat().length > 0;

  return (
    <>
      {/*
        hasCourseEnrollments
        && (
          <MediaQuery minWidth={breakpoints.large.minWidth}>
            {
              matches => (matches ? (
                <Sidebar data-testid="sidebar">
                  <CourseEnrollmentsFilter
                    groups={Object.values(COURSE_SECTION_TITLES)}
                    current={currentGroup}
                    selectGroup={setCurrentGroup}
                  />
                </Sidebar>
              ) : null)
            }
          </MediaQuery>
        )
      */}
      <MainContent className="col-lg-12">
        <h2 className="h2 mb-4 mt-4 text-strong">My Learning</h2>
        {showMarkCourseCompleteSuccess && (
          <CourseEnrollmentsAlert variant="success" onClose={() => setShowMarkCourseCompleteSuccess(false)}>
            Your course was saved for later.
          </CourseEnrollmentsAlert>
        )}
        {showMoveToInProgressCourseSuccess && (
          <CourseEnrollmentsAlert variant="success" onClose={() => setShowMoveToInProgressCourseSuccess(false)}>
            Your course was moved to In Progress.
          </CourseEnrollmentsAlert>
        )}
        {/*
          Only render children if there are no course enrollments or errors.
          This allows the parent component to customize what
          gets displayed if the user does not have any course enrollments.
        */}
        {!hasCourseEnrollments && children}
        {/*
        <>
          <CourseSection
            title={COURSE_SECTION_TITLES.current}
            courseRuns={currentCourseEnrollments}
          />
          <CourseSection
            title={COURSE_SECTION_TITLES.completed}
            courseRuns={completedCourseEnrollments}
          />
          <CourseSection
            title={COURSE_SECTION_TITLES.savedForLater}
            courseRuns={savedForLaterCourseEnrollments}
          />
        </>
        */}
        <Stack gap={3} className="mb-5">
          {
            ENROLLMENT_MAP[currentGroup].length
              ? ENROLLMENT_MAP[currentGroup].map(e => <NewCourseCard {...e} key={e.courseRunId} />)
              : (hasCourseEnrollments && (
                <div className="text-center mt-6">
                  <img src={CourseSearchIcon} alt="Search Courses Icon" />
                  <h4 className="h3 my-5">No Matching Results</h4>
                  <p>{NO_ENROLLMENT_MESSAGE[currentGroup]}</p>
                </div>
              ))
          }
        </Stack>
      </MainContent>
    </>
  );
};

CourseEnrollments.propTypes = {
  children: PropTypes.node,
};

CourseEnrollments.defaultProps = {
  children: null,
};

export default CourseEnrollments;
