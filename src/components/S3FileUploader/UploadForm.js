import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { Field } from 'redux-form'; // eslint-disable-line

const UploadForm = ({ wrapperCss, fields }) => (
  <div className={ wrapperCss }>
    {
      fields.map((f, ix) => {
        const fa = (
          <div className={ f.containerCss } key={ ix }>
            {
              f.hasLabel &&
              <div className={ f.labelCss }>
                <label> { f.label } </label>
              </div>
            }
            <div className={ f.componentCss }>
              {
                f.asField &&
                <Field
                  component={ f.component }
                  name={ f.name }
                  { ...(f.fieldProps) }
                />
              }
              {
                f.component && !f.asField && f.component
              }
            </div>
          </div>
        );
        return f.applyWrapper
          ? f.wrapContainer(fa)
          : (fa);
      })
    }
  </div>
);

export default UploadForm;

UploadForm.defaultProps = {
  wrapperCss: 'row borderTopGray'
};

/**
 * fields: Fields to render, containing object of upload from fields - following
 * containerCss: Main container classes for field to render
 *
 * hasLabel: adds a label (next two props are required if true)
 * label: Label Text
 * labelCss: className(s) for label (optional)
 *
 * asField: Render as a ReduxForm Field (needs name to be supplied)
 * name: Name prop for ReduxForm Field
 * fieldProps: optional custom props for ReduxForm Field
 * componentCss: Css class for component
 * component: Main Component to render (can be a func or an object)
 *
 * applyWrapper: Apply and wrap component using wrapContainer
 * wrapContainer: Required if applyWrapper is set to true
 *
 *
 * @type {{fields}}
 */
UploadForm.propTypes = {
  wrapperCss: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      applyWrapper: PropTypes.bool,
      wrapContainer: PropTypes.func,
      containerCss: PropTypes.string.isRequired,
      hasLabel: PropTypes.bool.isRequired,
      label: PropTypes.string,
      labelCss: PropTypes.string,
      asField: PropTypes.bool.isRequired,
      component: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object
      ]).isRequired,
      name: PropTypes.string,
      fieldProps: PropTypes.object,
      componentCss: PropTypes.string
    })
  ).isRequired
};
