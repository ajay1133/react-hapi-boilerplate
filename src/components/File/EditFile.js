import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Loader, Image } from 'semantic-ui-react';
import { Field } from 'redux-form/immutable';
import { getAbsoluteS3FileUrl } from '../../utils/commonutils';
import { MD_FILE_DRAFT_OPTIONS_LIST, DEFAULT_USER_PROFILE_IMAGE_URL } from '../../utils/constants';
import { TextBox, RadioGroup, RichEditor } from '../../components/Form';
import S3FileUploader from '../../components/S3FileUploader';
import config from '../../config';

class EditFile extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
		handleBlogImageFinishedUpload: PropTypes.func,
		resetBlogImageOnComplete: PropTypes.func,
		imageLoading: PropTypes.bool,
		uploadProfileImageUrl: PropTypes.string
	};
	
	render() {
		const { handleBlogImageFinishedUpload, resetBlogImageOnComplete, imageLoading, uploadProfileImageUrl } = this.props;
		
		return (
			<Form>
				<Field
					name="title"
					label="Title"
					component={ TextBox }
					placeholder="Enter Title"
				/>
				{
					imageLoading &&
					<Loader active inline='centered'>Loading...</Loader>
				}
				{
					!imageLoading &&
					<Image
						src={ getAbsoluteS3FileUrl(uploadProfileImageUrl) || DEFAULT_USER_PROFILE_IMAGE_URL }
						size="medium"
						rounded
						alt="image"
						centered
					/>
				}
				<S3FileUploader
					signingUrl={`${config.apiHost}/aws/uploadFile/blogImages`}
					onFileUpload={ handleBlogImageFinishedUpload }
					resetOnComplete={ resetBlogImageOnComplete }
					toShowContent={ ' Change Blog Image' }
				/>
				<Field
					name="draft"
					label="Draft"
					className="m-10"
					component={ RadioGroup }
					options={ MD_FILE_DRAFT_OPTIONS_LIST }
				/>
				<Field
					name="description"
					label="Description"
					component={ RichEditor }
					placeholder="Enter Description"
					autoHeight={true}
				/>
				<Field
					name="content"
					label="File Content"
					style={{ marginTop: '10px' }}
					component={ RichEditor }
					placeholder="Enter Content"
					autoHeight={true}
				/>
			</Form>
		)
	}
}

export default EditFile;