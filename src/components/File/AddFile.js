import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Field } from 'redux-form/immutable';
import { MD_FILE_DRAFT_OPTIONS_LIST } from '../../utils/constants';
import { fileNameValidator } from '../../utils/validations';
import { TextBox, RadioGroup, RichEditor } from '../../components/Form';

class AddFile extends Component {
	static propTypes = {
		repoPath: PropTypes.string,
		dispatch: PropTypes.func
	};
	
	render() {
		const { repoPath } = this.props;
		
		return (
			<Form>
				<div className="field">
					<div className="row">
						<div className="col-4">
							<strong>File Path</strong>
						</div>
						<div className="col-8">
							{ repoPath ? `${repoPath}/` : '/' }
						</div>
					</div>
				</div>
				<Field
					name="fileName"
					label="File Name *"
					component={TextBox}
					validate={ fileNameValidator }
					placeholder="Enter File Name"
				/>
				<Field
					name="title"
					label="Title"
					component={ TextBox }
					placeholder="Enter Title"
				/>
				<Field
					name="image"
					label="Image"
					component={ TextBox }
					placeholder={ `Enter Image Path Relative To ${repoPath ? `${repoPath}/` : '/'}` }
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
					placeholder="Enter File Content"
					autoHeight
				/>
			</Form>
		)
	}
}

export default AddFile;