import { baserow } from '../src';
import credentials from "../credentials.json";
import { workspaceBuilder } from '../src/builders/workspace.builder';
import { applicationFactory } from '../src/factories/application.factory';
import { appBuilder } from '../src/builders/app.builder';

const sdk = new baserow();
const appconnector = sdk.connector(
    credentials,
    false
)
var workspace:workspaceBuilder;
var applications: applicationFactory;
var application: appBuilder;
test('applications', async () => {
    await appconnector.connect();
    await appconnector.workspaces.list({}, {}, false);
    workspace = await appconnector.workspaces.create('jest:test-app:workspace', {});
    // await new Promise((r) => setTimeout(r, 1000));
    expect(workspace).toBeInstanceOf(workspaceBuilder);
    // await new Promise((r) => setTimeout(r, 1000));

    applications = workspace.applications;
    expect(applications).toBeInstanceOf(applicationFactory);

})
test('application:create',  async () => {
    application = await applications.create('jest:test-app');
    // await new Promise((r) => setTimeout(r, 1000));
    expect(application).toBeInstanceOf(appBuilder);
})
test('application:rename',  async () => {
    await new Promise((r) => setTimeout(r, 1000));
    await application.name('jest:test-app:rename');
    expect(application.app.name).toBe('jest:test-app:rename');
})
test('application:delete',  async () => {
    await new Promise((r) => setTimeout(r, 1000));
    await applications.rm(application.app.id);
    const app = applications.applications.find(w => w.id === application.app.id);
    expect(app).toBeUndefined();
})

test('application:workspaces:delete', async () => {
    await appconnector.workspaces.rm(workspace.workspace.id, {});
    const wp = appconnector.workspaces.workspaces.find(w => w.workspace.id === workspace.workspace.id);
    expect(wp).toBeUndefined();
})
