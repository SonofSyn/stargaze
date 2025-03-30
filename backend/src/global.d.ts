export {};
declare global {
    namespace Express {
        interface Request {
            kauth: { grant: GrantProperties };
        }
    }
}

interface GrantProperties {
    access_token?: KeycloakToken;
    refresh_token?: KeycloakToken;
    id_token?: KeycloakToken;
    expires_in?: string;
    token_type?: string;
}

export interface KeycloakToken {
    content: {
        exp: number;
        iat: number;
        jti: string;
        iss: string;
        aud: string[];
        sub: string;
        typ: string;
        azp: string;
        session_state: string;
        acr: string;
        'allowed-origins': string[];
        realm_access: { roles: string[] };
        resource_access: { [resource: string]: { roles: string[] } };
        scope: string;
        sid: string;
        email_verified: boolean;
        name: string;
        preferred_username: string;
        given_name: string;
        family_name: string;
        client_session: string;
    };
    token: string;
    clientId: string;
    header: {
        alg: string;
    };
    signature: Buffer;
    signed: string;
}
