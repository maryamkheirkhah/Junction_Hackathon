import React, { useEffect, useState } from 'react';
import styled, { withTheme } from 'styled-components';
import SearchComponent from '../../components/SearchComponent';
import GridPanel from '../../components/GridPanel';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import useDataApi from '../../utils/useDataApi';
import { useDebounce } from 'use-debounce';
import loginToken from '../../utils/loginToken';

const CLIENTS_API_URL = '/clients'; // REST endpoint for clients

const ClientsList = (props) => {
  const [listState, setListState] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const { data, isLoading, isFetchError, doFetch } = useDataApi(CLIENTS_API_URL);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 1000);

  useEffect(() => {
    // Fetch clients data on component mount
    doFetch({ url: CLIENTS_API_URL, params: {} });
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedData = data.map((row) => ({
        key: row.id,
        id: row.id,
        name: row.name,
        image: row.logo,
      }));
      setListState(formattedData);
      setIsFetching(false);
    } else {
      setIsFetching(false);
    }
  }, [data]);

  const handleSearch = (name, value) => {
    setSearch(value);
  };

  let searchResults = listState.filter((client) => {
    const clientName = client.name.toLowerCase();
    return clientName.includes(debouncedSearch.toLowerCase());
  });

  if (isFetchError)
    return (
      <ErrorMessage reloadHandler={() => doFetch({ url: CLIENTS_API_URL, params: {} })}>
        There was an error while loading data, please try again
      </ErrorMessage>
    );

  return (
    <Container>
      <ToolsPanel>
        {loginToken?.current?.credentials.includes('clients_management') && (
          <Button
            type={'submit'}
            textLabel={'+ Create New '}
            onClickHandler={() => props.navigateTo('/clients/add/')}
          />
        )}
        <SearchComponent handleSearch={handleSearch} id={'clientsSearch'} value={search} />
      </ToolsPanel>
      {searchResults.length === 0 && !isFetching ? (
        <div>No available clients data</div>
      ) : (
        <GridPanel
          topMargin={'0rem'}
          bottomMargin={'0rem'}
          data={searchResults}
          panel={DataPanel}
          handleClick={(item) =>
            props.navigateTo('/clients/manage/', { id: item.id, name: item.name })
          }
          listData={null}
          isFetching={isLoading}
        />
      )}
    </Container>
  );
};

export default ClientsList;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 1920px;
  padding: calc(1rem + 3vw);
`;

const ToolsPanel = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 4vw;
  align-items: center;
  justify-content: center;
  padding-bottom: 4vw;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 460px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Search = styled.div`
  width: 100%;
  background-color: #ffffff;
  font-size: calc(13px + 6 * (100vw - 320px) / 1920);
  //height: calc(13px + 6 * (100vw - 320px) / 1920);
  line-height: 2.6;
  grid-column-start: 2;
  grid-column-end: span 3;
  justify-self: flex-end;
`;

const DataPanel = props => {
  return (
    <DataPanelComp
      image={props.data.image}
      onClick={() => {
        props.handleClick(props.data.image);
      }}
    >
      <DataTitle image={props.data.image}>
        <DataText title={props.data.name}>{props.data.name}</DataText>
      </DataTitle>
    </DataPanelComp>
  );
};

//region Styles
const DataPanelComp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-content: center;
  width: 12.5vw;
  height: 12.5vw;
  max-width: 240px;
  max-height: 240px;
  min-width: 180px;
  min-height: 180px;
  background-color: white;
  cursor: pointer;

  transition: all 0.3s ease-in-out;
  clip-path: polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%);
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.11);
  background-image: ${props => `url(${props.image})`};
  background-size: 50% auto;
  background-repeat: no-repeat;
  background-position: center 45%;

  &:hover {
    background-color: #fcfce9;
  }
`;
const Element = styled.img.attrs(props => ({ src: props.image }))`
  //background-color: #ff4f54;
  width: 100%;
  max-width: 240px;
  align-self: center;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;
const DataTitle = styled.div`
  width: 100%;
  background-color: #373737;
  text-align: center;
  color: #ffffff;
  font-size: calc(13px + 5 * (100vw - 320px) / 1920);
  line-height: 2.5rem;
  font-weight: 700;
  font-family: 'Catamaran', sans-serif;
`;
const DataText = styled.div`
  width: 90%;
  margin: 0 auto;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
//endregion
