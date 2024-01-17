import { baserow } from '../src';
import credentials from "../credentials.json";
import { workspaceBuilder } from '../src/builders/workspace.builder';

test('create an instance', () => {
    const sdk = new baserow();
    expect(sdk).toBeInstanceOf(baserow); 
});
test('connexion', async () => {
    const sdk = new baserow();
    const connector = sdk.connector(
        credentials,
        false
    )
    await connector.connect()
    expect(connector._setups.user?.access_token).toBeDefined()
});


test('workspaces', async () => {
    const sdk = new baserow();
    const connector = sdk.connector(
        credentials,
        false
    )
    await connector.connect();
    await connector.workspaces.list({}, {}, false);
    for(const wp of connector.workspaces.workspaces) {
        expect(wp).toBeInstanceOf(workspaceBuilder);
    }
})
