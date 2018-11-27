import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Field } from 'redux-form/immutable';
import { TextBox, TextArea } from '../../components/Form';

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
					label="File Name"
					component={TextBox}
					placeholder="Enter File Name"
				/>
				<Field
					name="content"
					label="File Content"
					component={TextArea}
					placeholder="Enter File Content"
					autoHeight
				/>
			</Form>
		)
	}
}

export default AddFile;