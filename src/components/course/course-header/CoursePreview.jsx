import React from 'react';
import PropTypes from 'prop-types';
// import { PlayCircleFilled } from '@edx/paragon/icons';
import { useToggle, Image } from '@edx/paragon';
// import { VideoPlayer } from '../../video';

const CoursePreview = ({ previewImage, previewVideoURL, partnerLogoUrl }) => {
  // const [isVideoPlaying, playVideo] = useToggle(false);
  const logoStyle = {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    borderRadius: '0.25rem',
    maxHeight: '100px',
    maxWidth: '192px',
    boxShadow: '0px 1px 4px 0px #00000026',
    padding: '0.5rem',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  };

  return (
    <div className="course-preview-wrapper d-flex" style={{ justifyContent: 'center', overflow: 'hidden', height: '100%' }}>
      {/*previewVideoURL ? (
        <div className="video-component">
          {isVideoPlaying ? (
            <div className="video-wrapper">
              <VideoPlayer videoURL={previewVideoURL} />
            </div>
          ) : (
            <button
              className="video-trigger mw-100"
              onClick={() => playVideo(true)}
              type="button"
            >
              <Image src={previewImage} className="video-thumb" alt="" />
              <div className="video-trigger-cta btn btn-inverse-primary">
                <PlayCircleFilled className="mr-1" />
                Play Video
              </div>
            </button>
          )}
        </div>
      ) : (
        <Image src={previewImage} alt="Course Preview Image" className="flex-shrink-0" />
      )*/}
      <Image src={previewImage} alt="Course Preview Image" className="flex-shrink-0" />
      {partnerLogoUrl && (
        <Image src={partnerLogoUrl} alt="Logo" style={logoStyle} />
      )}
    </div>
  );
};

CoursePreview.propTypes = {
  previewImage: PropTypes.string.isRequired,
  previewVideoURL: PropTypes.string,
  partnerLogoUrl: PropTypes.string,
};

CoursePreview.defaultProps = {
  previewVideoURL: null,
  partnerLogoUrl: null,
};

export default CoursePreview;
