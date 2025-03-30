import React, { FC, ReactNode, useEffect, useState } from 'react';

import {
    GlobalAccountSettingsContext,
    defaultAccountSettingsState,
    IAccountSettingsContext,
    GlobalAccountSettingsCxt,
} from './GlobalAccountSettingsContext';
import { defaultKeyloakState, GlobalKeycloakCxt, GlobalKeycloakContext, IKeycloakContext } from './GlobalKeycloakContext';
import { defaultGlobalState, GlobalStateCxt, GlobalStateContext, IStateContext } from './GlobalStateContext';
import { defaultViewState, GlobalViewCxt, GlobalViewContext, IViewContext } from './GlobalViewContext';

export interface IContext {
    stateContext: IStateContext;
    keycloakContext: IKeycloakContext;
    viewContext: IViewContext;
    accountSettingsContext: IAccountSettingsContext;
}

export const defaultContext: IContext = {
    stateContext: defaultGlobalState,
    keycloakContext: defaultKeyloakState,
    viewContext: defaultViewState,
    accountSettingsContext: defaultAccountSettingsState,
};

export const GlobalCxt = React.createContext<IContext>(defaultContext);

const GlobalContext: FC<{ children: ReactNode }> = ({ children }) => {
    const { keycloak, setKeycloak }: IKeycloakContext = React.useContext(GlobalKeycloakCxt);
    const { view, setView }: IViewContext = React.useContext(GlobalViewCxt);
    const { apiurl }: IStateContext = React.useContext(GlobalStateCxt);
    const { currentCssDesign, setCssDesign }: IAccountSettingsContext = React.useContext(GlobalAccountSettingsCxt);
    const [render, setRender] = useState(false);

    const toggleRender = () => setRender(!render);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = undefined;
        keycloak
            .init({ onLoad: 'login-required', checkLoginIframe: false })
            .then(async function () {
                setKeycloak(keycloak);

                setCssDesign('default');
                toggleRender();

                interval = setInterval(async () => {
                    console.warn('Updating token in frontend now');
                    await keycloak.updateToken(300);
                    setKeycloak(keycloak);
                }, 4 * 60 * 1000);
            })
            .catch(function () {
                alert('failed to initialize');
                return () => {
                    if (interval) {
                        const intervalId = interval[Symbol.toPrimitive]();
                        clearInterval(intervalId);
                    }
                };
            });
        return () => {
            if (interval) {
                const intervalId = interval[Symbol.toPrimitive]();
                clearInterval(intervalId);
            }
        };
    }, []);
    return (
        <GlobalCxt.Provider
            value={{
                stateContext: { apiurl },
                keycloakContext: { keycloak, setKeycloak },
                viewContext: { view, setView },
                accountSettingsContext: { currentCssDesign, setCssDesign },
            }}
        >
            {children}
        </GlobalCxt.Provider>
    );
};

export const GlobalContextAnchor: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <GlobalStateContext>
            <GlobalViewContext>
                <GlobalKeycloakContext>
                    <GlobalAccountSettingsContext>
                        <GlobalContext> {children} </GlobalContext>
                    </GlobalAccountSettingsContext>
                </GlobalKeycloakContext>
            </GlobalViewContext>
        </GlobalStateContext>
    );
};
