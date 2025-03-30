import React, { FC, ReactNode, useEffect, useState } from 'react';

export interface IStateContext {
    apiurl: string;
}

export const defaultGlobalState: IStateContext = {
    apiurl: window.location.href.indexOf('http://localhost:3000') >= 0 ? 'http://localhost:3002' : window.location.origin,
};

export const GlobalStateCxt = React.createContext<IStateContext>(defaultGlobalState);

export const GlobalStateContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [apiurl] = useState(defaultGlobalState.apiurl);
    return (
        <GlobalStateCxt.Provider
            value={{
                apiurl,
            }}
        >
            {children}
        </GlobalStateCxt.Provider>
    );
};
