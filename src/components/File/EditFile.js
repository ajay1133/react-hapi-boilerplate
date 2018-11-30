import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Field } from 'redux-form/immutable';
import { MD_FILE_DRAFT_OPTIONS_LIST } from '../../utils/constants';
import { TextBox, RadioGroup, RichEditor } from '../../components/Form';

class EditFile extends Component {
	static propTypes = {
		dispatch: PropTypes.func
	};
	
	render() {
		return (
			<Form>
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
					placeholder="Enter Image Path Relative To Root"
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