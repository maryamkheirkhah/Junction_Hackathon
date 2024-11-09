import React from 'react';
import styled from 'styled-components';
import magnifier_01 from '../../assets/images/magnifier_01.svg';
import { FormThemes } from '../../utils/themes';
import TextFieldModernUI from '../TextfieldModernUI';

const SearchComponent = props => {
  return (
    <Search>
      <TextFieldModernUI
        id={props.id}
        autoComplete="nope"
        labelName={''}
        placeholder={props.placeholder ? props.placeholder : 'Search'}
        value={props.value}
        hideLabel={true}
        icon={magnifier_01}
        name={'searchComponent' + props.id}
        onChange={props.handleSearch}
        type={'text'}
        borderRadius={'6px'}
        hideCounter
        customThemes={FormThemes}
      />
    </Search>
  );
};

export default SearchComponent;

const Search = styled.div`
  width: 100%;
`;
