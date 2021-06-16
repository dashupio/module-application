
import React from 'react';
import { View } from '@dashup/ui';

// application page
const ApplicationPage = (props = {}) => {

  // get props
  const getProps = () => {
    // clone
    const newProps = { ...(props) };

    // delete
    delete newProps.type;
    delete newProps.view;
    delete newProps.struct;

    // return
    return newProps;
  };

  // return jsx
  return (
    <View { ...getProps() } type="page" view="dashboard" struct="dashboard" />
  );
};

// export default
export default ApplicationPage;