import React from 'react';
import { GlobalCxt, IContext } from '../context/GlobalContext';

export default function Dashboard() {
    const { keycloakContext, viewContext }: IContext = React.useContext(GlobalCxt);

    return <></>;
}
