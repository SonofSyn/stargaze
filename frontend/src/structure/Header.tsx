import React from 'react';
import { Button, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { GlobalCxt, IContext } from '../context/GlobalContext';

interface Props {
    projectTitle: string;
}

/**
 *
 * Header Column with tribe logo
 * @return {JSX.Element}
 */
export const Header = (props: Props): JSX.Element => {
    const { viewContext, keycloakContext }: IContext = React.useContext(GlobalCxt);
    return (
        <header className="row row_header app_header ">
            <Navbar expand="lg">
                <Navbar.Brand className={'header_user_product_logo'}>
                    <h3
                        className={'header_user_title header_user_icon'}
                        onClick={() => {
                            viewContext.setView('dashboard');
                        }}
                    >
                        {props.projectTitle}
                    </h3>
                </Navbar.Brand>

                <Navbar.Toggle />

                <div className={'header_user_button_group'}>
                    <Button disabled className={'header_user_status_button'}>
                        {keycloakContext.keycloak.tokenParsed?.preferred_username}
                    </Button>
                    <Button
                        onClick={() => {
                            if (keycloakContext.keycloak.authenticated) {
                                keycloakContext.keycloak.logout({
                                    redirectUri:
                                        window.location.href === 'http://localhost:3000/' ? window.location.href : window.location.origin,
                                });
                            }
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </Navbar>
        </header>
    );
};
