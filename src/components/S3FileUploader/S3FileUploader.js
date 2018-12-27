import React from 'react';
import PropTypes from 'prop-types';
import { Icon, List } from "semantic-ui-react"; // eslint-disable-line
import DropZone from "react-dropzone"; // eslint-disable-line
import FileUploader from "./FileUploader"; // eslint-disable-line

export default class S3FileUploader extends React.Component {
  static get propTypes () {
    return {
      fileName: PropTypes.string,
      signingUrl: PropTypes.string.isRequired,
      onFileUpload: PropTypes.func.isRequired,
      resetOnComplete: PropTypes.func,
	    toShowContent: PropTypes.string
    };
  }
  
  static get contextTypes () {
    return {
      store: PropTypes.object
    };
  }
  
  constructor () {
    super();
    
    this.state = {
      files: [],
      saveFileError: null
    };
  };
  
  onDrop = (acceptedFiles) => {
    const { files } = this.state;
    this.setState({
      files: files.concat(acceptedFiles)
    });
  };
  
  uploadCompleted = (data) => {
    const self = this;
    const { resetOnComplete } = this.props;
    
    const files = self.state.files;
    const idx = files.findIndex(file => file.name === data.name);
    
    if (idx > -1) {
      files.splice(idx, 1);
      self.setState({ files });
    }
    
    if (files.length === 0 && resetOnComplete && typeof resetOnComplete === 'function') {
      resetOnComplete(data);
    }
  };
  
  render () {
    const { fileName, signingUrl, onFileUpload, toShowContent } = this.props;
    const { files } = this.state;
    
    const style = {
      borderWidth: '2px',
      borderColor: '#000',
      borderStyle: 'dashed',
      borderRadius: '2px',
      padding: '5px',
	    width: '73%',
	    margin: '15px auto',
    };
    
    const defaultContent = ' Drag & Drop or Select a file to upload';
    
    return (
      <div style={{ cursor: 'cross-hair' }}>
        <DropZone
          multiple={ false }
          onDrop={ this.onDrop }
          style={ style }
        >
          <div className="text-center">
            <Icon size="big" name="cloud upload" />
            { toShowContent || defaultContent }
          </div>
        </DropZone>
        {
          !!files.length &&
          <List divided relaxed>
	          {
	            <FileUploader
                fileName={ fileName }
                key={ `img-${files[files.length - 1].name}` }
                file={ files[files.length - 1] }
                onFileUpload={ onFileUpload }
                onUploadComplete={ this.uploadCompleted }
                signingUrl={ signingUrl }
		          />
	          }
          </List>
        }
      </div>
    );
  }
}
