import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Loading = ({isLoading, error}) => {
  // Handle the loading state
  if (isLoading) {
    return <Dimmer active inverted>
            <Loader content="Loading..." />
          </Dimmer>;
  }
  // Handle the error state
  else if (error) {
    return <Dimmer active inverted>
      <Loader content="Sorry, there was a problem loading the page." />
    </Dimmer>;
  }
  else {
    return null;
  }
};


export default Loading;