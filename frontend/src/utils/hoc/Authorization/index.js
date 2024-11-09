import React from 'react';
import loginToken from '../../loginToken';
import AccessDenied from '../../../content/AccessDeniedView';
import LoadingComponent from '../../../components/LoadingComponent';

const Authorization = privilegesNeeded => WrappedComponent => {
  return class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const privileges = loginToken.current.credentials;
      if (!privileges || privileges.length === 0)
        return (
          <div>
            <LoadingComponent />
          </div>
        );
      for (let privilege of privileges) {
        if (privilegesNeeded.includes(privilege)) {
          return <WrappedComponent {...this.props} user={this.props.user} />;
        }
      }
      return <AccessDenied {...this.props} />;
    }
  };
};

export default Authorization;
