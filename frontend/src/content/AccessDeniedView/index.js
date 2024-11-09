import React from 'react';
import AccessDenied from '../../components/AccessDenied';
import { AppContext } from '../../contexts/AppContext';

const AccessDeniedView=props=>{
  let {navigation} = React.useContext(AppContext);
  return(<AccessDenied navigateTo={(destination)=>navigation.dispatch({ destination: destination.split('?')[0]})}/>)
}

export default AccessDeniedView;