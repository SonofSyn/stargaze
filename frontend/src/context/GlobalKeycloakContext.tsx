import Keycloak from 'keycloak-js';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { KeycloakEnvironment } from '../interface';

export interface IKeycloakContext {
    keycloak: Keycloak;
    setKeycloak: (keycloak: Keycloak) => void;
}
const env: KeycloakEnvironment = window['SERVER_DATA' as any] as any;

export const defaultKeyloakState: IKeycloakContext = {
    keycloak: new Keycloak({
        url: env.tokenURL !== 'undefined' ? env.tokenURL : 'https://login.ttapp.ttdev.local',
        clientId: env.clientID !== 'undefined' ? env.clientID : 'camapi',
        realm: env.realm !== 'undefined' ? env.realm : 'Tribe',
    }),
    setKeycloak: (keycloak: Keycloak) => {},
    
};

export const GlobalKeycloakCxt = React.createContext<IKeycloakContext>(defaultKeyloakState);

export const GlobalKeycloakContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [keycloak, setKeycloak] = useState<Keycloak>(defaultKeyloakState.keycloak);
    return (
        <GlobalKeycloakCxt.Provider
            value={{
                keycloak,
                setKeycloak,
            }}
        >
            {children}
        </GlobalKeycloakCxt.Provider>
    );
};
