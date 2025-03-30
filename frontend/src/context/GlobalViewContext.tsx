import React, { FC, ReactNode, useEffect, useState } from 'react';
export type View = 'dashboard';

export interface IViewContext {
    view: View;
    setView: (view: View) => void;
}

export const defaultViewState: IViewContext = {
    view: 'dashboard',
    setView: (view: View) => {},
};

export const GlobalViewCxt = React.createContext<IViewContext>(defaultViewState);

export const GlobalViewContext: FC<{ children: ReactNode }> = ({ children }) => {
    const [view, setView] = useState<View>(defaultViewState.view);
    const setViewWithHistory = (view: View) => {
        window.history.pushState({ view }, document.title, window.location.href);
        setView(view);
    };

    const setHistoryView = () => {
        setView(window.history.state.view);
    };

    useEffect(() => {
        window.history.pushState({ view }, document.title, window.location.href);
    }, []);

    useEffect(() => {
        window.addEventListener('popstate', setHistoryView);
        return () => {
            window.removeEventListener('popstate', setHistoryView);
        };
    }, [setHistoryView]);
    return (
        <GlobalViewCxt.Provider
            value={{
                view,
                setView: setViewWithHistory,
            }}
        >
            {children}
        </GlobalViewCxt.Provider>
    );
};
