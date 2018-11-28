import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Field } from 'redux-form/immutable';
import { strictValidObjectWithKeys } from '../../utils/commonutils';
import { MD_FILE_DRAFT_OPTIONS_LIST } from '../../utils/constants';
import { TextBox, TextArea, RadioGroup, RichEditor } from '../../components/Form';

class EditFile extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
		initialValues: PropTypes.object
	};
	
	render() {
		const { initialValues } = this.props;
		
		const valueKeys = (strictValidObjectWithKeys(initialValues) && Object.keys(initialValues)) || [];
		
		if (!valueKeys.length) {
			return <div/>;
		}
		
		return (
			<Form>
				{
					valueKeys.indexOf('title') > -1 &&
					<Field
						name="title"
						label="Title"
						component={ TextBox }
						placeholder="Enter Title"
					/>
				}
				{
					valueKeys.indexOf('image') > -1 &&
					<Field
						name="image"
						label="Image"
						component={ TextBox }
						placeholder="Enter Image Path Relative To Root"
					/>
				}
				{
					valueKeys.indexOf('draft') > -1 &&
					<Field
						name="draft"
						label="Draft"
						className="w50"
						component={ RadioGroup }
						options={ MD_FILE_DRAFT_OPTIONS_LIST }
					/>
				}
				{
					valueKeys.indexOf('description') > -1 &&
					<Field
						name="description"
						label="Description"
						component={ TextArea }
						placeholder="Enter Description"
						autoHeight={true}
					/>
				}
				{
					valueKeys.indexOf('content') > -1 &&
					<Field
						name="content"
						label="File Content"
						component={ RichEditor }
						placeholder="Enter Content"
						autoHeight={true}
					/>
				}
			</Form>
		)
	}
}

export default EditFile;