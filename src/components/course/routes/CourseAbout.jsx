import React from 'react';
import { Container, Row } from '@openedx/paragon';

import CourseHeader from '../course-header/CourseHeader';
import CourseMainContent from '../CourseMainContent';

const CourseAbout = () => (
  <>
    <CourseHeader />
    <Container size="lg">
      <Row>
        <CourseMainContent />
      </Row>
    </Container>
  </>
);

export default CourseAbout;
