import React, { FC, ReactNode, useEffect, useState } from 'react';

/**
 * Function to read the last current design, if for example the app is closed
 *
 * @param {CSSDesign} [defaultValue="ttunited"]
 * @returns {CSSDesign}
 */
export const getDesignFromLocalStorage = (defaultValue: CSSDesign = 'default'): CSSDesign => {
    const design = localStorage.getItem('currentCssDesign');
    switch (design) {
        case 'default':
            return design;
    }
    return defaultValue;
};

export type CSSDesign = 'default' | 'darkmode';

export interface IAccountSettingsContext {
    currentCssDesign: CSSDesign;
    setCssDesign: (design: CSSDesign) => void;
}

export const defaultAccountSettingsState: IAccountSettingsContext = {
    currentCssDesign: getDesignFromLocalStorage('default'),
    setCssDesign: (design: CSSDesign) => {},
};

export const GlobalAccountSettingsCxt = React.createContext<IAccountSettingsContext>(defaultAccountSettingsState);

export const GlobalAccountSettingsContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [currentCssDesign, setCssDesignState] = useState(defaultAccountSettingsState.currentCssDesign);
    const setCssDesign = (design: CSSDesign) => {
        document.body.classList.remove(currentCssDesign);
        document.body.classList.add(design);
        localStorage.setItem('currentCssDesign', design);
        setCssDesignState(design);
    };

    return (
        <GlobalAccountSettingsCxt.Provider
            value={{
                currentCssDesign,
                setCssDesign,
            }}
        >
            {children}
        </GlobalAccountSettingsCxt.Provider>
    );
};
