import { baserow } from '../src';
import credentials from "../credentials.json";
import { workspaceBuilder } from '../src/builders/workspace.builder';

const sdk = new baserow();
const connector = sdk.connector(
    credentials,
    false
)
var workspace:workspaceBuilder;

test('workspaces', async () => {
    await connector.connect();
    await connector.workspaces.list({}, {}, false);
    for (const wp of connector.workspaces.workspaces) {
        expect(wp).toBeInstanceOf(workspaceBuilder);
    }
})

test('workspaces:create', async () => {
    const exist = connector.workspaces.workspaces.find(wp => wp.workspace.name  == 'jest:test-workspace');
    if (exist) workspace = exist;
    else workspace = await connector.workspaces.create('jest:test-workspace', {});
    expect(workspace).toBeInstanceOf(workspaceBuilder);
})

test('workspaces:rename', async () => {
    expect(workspace).toBeInstanceOf(workspaceBuilder);
    await workspace.update('jest:test-workspace:updated');
    expect(workspace.workspace.name).toBe('jest:test-workspace:updated');
})

test('workspaces:delete', async () => {
    await connector.workspaces.rm(workspace.workspace.id, {});
    const wp = connector.workspaces.workspaces.find(w => w.workspace.id === workspace.workspace.id);
    expect(wp).toBeUndefined();
})
