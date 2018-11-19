import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Field } from 'redux-form/immutable';
import TextBox from '../../components/Form/TextBox';
import TextArea from '../../components/Form/TextArea';

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
					component={TextBox}
					placeholder="Enter Content"
				/>
				<Field
					name="date"
					label="Date"
					component={TextBox}
					placeholder="Enter Date"
				/>
				<Field
					name="type"
					label="Type"
					component={TextBox}
					placeholder="Enter Type"
				/>
				<Field
					name="image"
					label="Image"
					component={TextBox}
					placeholder="Enter Image"
				/>
				<Field
					name="tags"
					label="Tags"
					component={TextBox}
					placeholder="Enter Tags"
					autoHeight
				/>
				<Field
					name="draft"
					label="Draft"
					component={TextBox}
					placeholder="Enter Draft"
				/>
				<Field
					name="content"
					label="File Content"
					component={TextArea}
					placeholder="Enter File Content"
					autoHeight={true}
				/>
			</Form>
		)
	}
}

export default EditFile;