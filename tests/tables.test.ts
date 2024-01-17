import { baserow } from '../src';
import credentials from "../credentials.json";
import { workspaceBuilder } from '../src/builders/workspace.builder';
import { applicationFactory } from '../src/factories/application.factory';
import { appBuilder } from '../src/builders/app.builder';
import { tablesFactory } from '../src/factories/tables.factory';
import { tableBuilder } from '../src/builders/table.builder';

const sdk = new baserow();
const tableconnector = sdk.connector(
    credentials,
    false
)
var workspace:workspaceBuilder;
var applications: applicationFactory;
var application: appBuilder;
var tables: tablesFactory;
var table: tableBuilder;
test('tables:init', async () => {
    await tableconnector.connect();
    await tableconnector.workspaces.list({}, {}, false);
    const exist = tableconnector.workspaces.workspaces.find(wp => wp.workspace.name === 'jest:test-app:workspace:tables');
    if(exist) workspace= exist;
    else workspace = await tableconnector.workspaces.create('jest:test-app:workspace:tables', {});
    expect(workspace).toBeInstanceOf(workspaceBuilder);
    applications = workspace.applications;
    expect(applications).toBeInstanceOf(applicationFactory);
    application = await applications.create('jest:test-app:tables');
    // await new Promise((r) => setTimeout(r, 1000));
    expect(application).toBeInstanceOf(appBuilder);
})

test('tables:create', async () => {
    await application.getTables(true);
    tables = application.tables;
    table = await tables.create('jest:table-test');
    await table.fetch();
    expect(table).toBeInstanceOf(tableBuilder);
    expect(table._DATA).toBeDefined();
})

test('tables:rename', async () => {
    await new Promise((r) => setTimeout(r, 1000));
    await table.name('jest:table-test:renamed');
    expect(table._DATA?.name).toBe('jest:table-test:renamed')
});

test('tables:delete', async () => {
    await tables.delete(table);
    const deleted = tables.tables.find(w => w.id === table._DATA!.id);
    expect(deleted).toBeUndefined();
    await tableconnector.workspaces.rm(workspace.workspace.id, {});
});

