// useDataApi.js
import { portalClient, authClient } from 'utils/apiClient'; // Assuming these are Axios instances for REST
import { useEffect, useReducer, useState } from 'react';

const useDataApi = (initialUrl = '', initialParams = {}, initialData = null) => {
  const [fetchCall, setFetchCall] = useState({ url: initialUrl, params: initialParams });
  const [mutateCall, setMutateCall] = useState({ url: '', data: {} });

  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isFetchError: false,
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isFetchError: false,
          data: action.payload,
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isFetchError: true,
        };
      default:
        throw new Error();
    }
  };

  const dataMutationReducer = (state, action) => {
    switch (action.type) {
      case 'MUTATE_INIT':
        return {
          ...state,
          isSending: true,
          isMutateError: false,
        };
      case 'MUTATE_SUCCESS':
        return {
          ...state,
          isSending: false,
          isMutateError: false,
          mutateData: action.payload,
        };
      case 'MUTATE_FAILURE':
        return {
          ...state,
          isSending: false,
          isMutateError: true,
          mutateError: action.payload,
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isFetchError: false,
    data: initialData,
    params: initialParams,
  });

  const [mutateState, mutateDispatch] = useReducer(dataMutationReducer, {
    isSending: false,
    isMutateError: false,
    mutateData: null,
    mutateParams: {},
  });

  // Fetch data with GET request
  useEffect(() => {
    let didCancel = false;
    if (!fetchCall.url) return;

    dispatch({ type: 'FETCH_INIT' });

    portalClient
      .get(fetchCall.url, { params: fetchCall.params })
      .then((response) => {
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        }
      })
      .catch(() => {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      });

    return () => {
      didCancel = true;
    };
  }, [fetchCall]);

  // Modify data with POST request
  useEffect(() => {
    let didCancel = false;
    if (!mutateCall.url) return;

    mutateDispatch({ type: 'MUTATE_INIT' });

    portalClient
      .post(mutateCall.url, mutateCall.data)
      .then((response) => {
        if (!didCancel) {
          mutateDispatch({ type: 'MUTATE_SUCCESS', payload: response.data });
        }
      })
      .catch((error) => {
        if (!didCancel) {
          mutateDispatch({ type: 'MUTATE_FAILURE', payload: error.message });
        }
      });

    return () => {
      didCancel = true;
    };
  }, [mutateCall]);

  const doFetch = (fetchCall) => {
    setFetchCall(fetchCall);
  };

  const doMutation = (mutateCall) => {
    setMutateCall(mutateCall);
  };

  return { ...state, ...mutateState, doFetch, doMutation };
};

export default useDataApi;
