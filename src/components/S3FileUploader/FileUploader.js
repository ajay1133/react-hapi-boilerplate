import React from "react"; // eslint-disable-line
import PropTypes from 'prop-types';
import { List, Image } from "semantic-ui-react"; // eslint-disable-line
import S3Upload from './S3Upload';
import ProgressBar from "../ProgressBar"; // eslint-disable-line


export default class FileUploader extends React.Component {
  static get propTypes () {
    return {
      file: PropTypes.shape({
        lastModified: PropTypes.number,
        lastModifiedDate: PropTypes.date,
        name: PropTypes.string,
        preview: PropTypes.string,
        size: PropTypes.number,
        type: PropTypes.string,
        webkitRelativePath: PropTypes.string
      }).isRequired,
      onFileUpload: PropTypes.func.isRequired,
      onUploadComplete: PropTypes.func.isRequired,
      signingUrl: PropTypes.string,
      saveFileError: PropTypes.string,
      fileName: PropTypes.string
    };
  }
  
  constructor () {
    super();
    
    this.state = {
      progress: 0,
      status: false,
      error: null
    };
  };
  
  componentDidMount () {
    const { file, fileName } = this.props;
    file.fileName = fileName;
    const files = [file];
    
    new S3Upload({ // eslint-disable-line
      files,
      signingUrl: this.props.signingUrl,
      onProgress: this.onUploadProgress,
      onError: this.onUploadError,
      onFinishS3Put: this.onUploadFinish,
      uploadRequestHeaders: {}
    });
  }
  
  onUploadProgress = (progress, status) => this.setState({ progress, status });
  
  onUploadError = error => this.setState({ error });
  
  onUploadFinish = (signResult) => {
    const { file, onFileUpload, onUploadComplete } = this.props;
    const data = {
      name: file.name,
      type: file.type,
      size: file.size,
      s3Key: signResult.publicUrl
    };
    
    onFileUpload(data)
      .then(() => onUploadComplete(data))
      .catch(error => this.setState({ error: error.message || error }));
  };
  
  isImg = (fileName) => {
    const idx = fileName.lastIndexOf('.');
    const ext = fileName.substring(idx).toLowerCase();
    
    return ['.jpg', '.jpeg', '.gif', '.png', '.tiff', '.tif', '.bmp'].indexOf(ext) > -1;
  };
  
  render () {
    const { file, saveFileError } = this.props;
    const { progress, status, error } = this.state;
    const err = error || saveFileError;
    
    const completed = (status === 'Upload completed');
    const clsNormal = err ? 'text-danger' : 'text-info';
    const textClsName = completed ? 'text-success' : clsNormal;
    
    return (
      <div className="text-center">
        <List.Item>
          <List.Content>
            <List.Header>{ file.name }</List.Header>
            {
              !err &&
              (
                <div>
                  <ProgressBar progressValue={ progress } />
                  <p className={ textClsName }>
                    <strong>
                      { completed ? 'Saving details' : status }
                      { progress > 0 && progress < 100 ? `${progress}%` : '' }
                    </strong>
                  </p>
                </div>
              )
            }
            {
              err && <p className="text-danger">{ err }</p>
            }
          </List.Content>
        </List.Item>
      </div>
    );
  }
}
