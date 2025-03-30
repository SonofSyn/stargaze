import React, { useEffect, useState } from 'react';
import { GlobalCxt, IContext } from './context/GlobalContext';
import './scss/main.scss';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import Body from './structure/Body';
import { Header } from './structure/Header';
interface Props {}

export default function App(props: Props) {
    const { keycloakContext, viewContext }: IContext = React.useContext(GlobalCxt);

    return (
        <div>
            <Header projectTitle="Stargaze" />
            {keycloakContext.keycloak.authenticated ? <Body /> : <></>}
        </div>
    );
}
