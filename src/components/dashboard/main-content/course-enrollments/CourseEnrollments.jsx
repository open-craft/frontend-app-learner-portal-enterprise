import React, { useContext, useMemo } from 'react';
import { MediaQuery, Stack, breakpoints } from '@edx/paragon';

import PropTypes from 'prop-types';
import CourseSection from './CourseSection';

import CourseEnrollmentsAlert from './CourseEnrollmentsAlert';
import { CourseEnrollmentsContext } from './CourseEnrollmentsContextProvider';
import { sortedEnrollmentsByEnrollmentDate } from './data/utils';
import NewCourseCard from './course-cards/NewCourseCard';
import { MainContent, Sidebar } from '../../../layout';

export const COURSE_SECTION_TITLES = {
  current: 'My courses',
  completed: 'Completed courses',
  savedForLater: 'Saved for later',
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
      {
        hasCourseEnrollments
        && (
          <MediaQuery minWidth={breakpoints.large.minWidth}>
            {
              matches => (matches ? (
                <Sidebar data-testid="sidebar">
                  <p>Here comes the filtering</p>
                </Sidebar>
              ) : null)
            }
          </MediaQuery>
        )
      }
      <MainContent className={!hasCourseEnrollments && 'col-lg-12'}>
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
        <Stack gap={3}>
          {currentCourseEnrollments.map(e => <NewCourseCard {...e} key={e.courseRunId} />)}
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
