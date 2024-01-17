import { baserow } from '../src';
import credentials from "../credentials.json";
import { workspaceBuilder } from '../src/builders/workspace.builder';
import { applicationFactory } from '../src/factories/application.factory';
import { appBuilder } from '../src/builders/app.builder';
import { tablesFactory } from '../src/factories/tables.factory';
import { tableBuilder } from '../src/builders/table.builder';
import { fieldBuilder } from '../src/builders/field.builder';
import { FIELD_TYPE } from '../src/types/fields';
import { fieldConstructor } from '../src/builders/fields/field.constructor';
import { textConstructor } from '../src/builders/fields/text.constructor';
import { booleanConstructor } from '../src/builders/fields/boolean.constructor';
import { countConstructor } from '../src/builders/fields/count.constructor';
import { link_rowConstructor } from '../src/builders/fields/link_row.constructor';

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
var fields:fieldBuilder[];
var field: fieldBuilder;
test('fields:init', async () => {
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
    await application.getTables(true);
    tables = application.tables;
    table = await tables.create('jest:table-test');
    await table.fetch();
    expect(table).toBeInstanceOf(tableBuilder);
    expect(table._DATA).toBeDefined();
})

test('fields:fetch', async () => {
    await table.getFields();
    fields = table.fields;
    for(const field of fields) {
        expect(field).toBeInstanceOf(fieldBuilder);
    }
    expect(true).toBeTruthy();
})

test('fields:create', async () => {
    const before = parseInt(fields.length.toString());
    field = table.addingField({
        type: FIELD_TYPE.FIELD_TEXT,
        name: 'jest:field'
    });
    await table.addField(field);
    field = table.fields.find(f => f.field.name == 'jest:field')!;
    await new Promise((r) => setTimeout(r, 1000));
    expect(fields.length).toBeGreaterThan(before);
})

test('fields:update', async () => {
    field.name("jest:field:renamed")
    await field.update();
    expect(field.field.name).toBe('jest:field:renamed');
    field.name('jest:field:renamed:fromtable');
    (field.ctor as textConstructor).text_default("jest:simon:says");
    await table.updateField(field);
})

test('fields:update:types', async () => {
    field.type(FIELD_TYPE.FIELD_BOOLEAN);
    await field.update();
    expect(field.ctor).toBeInstanceOf(booleanConstructor);

    field.type(FIELD_TYPE.FIELD_COUNT);
    (field.ctor as countConstructor).through_field_id(3);
    await field.update();
    expect(field.ctor).toBeInstanceOf(countConstructor);

    field.type(FIELD_TYPE.FIELD_LINK_ROW);
    (field.ctor as link_rowConstructor).link_row_table_id(1);
    (field.ctor as link_rowConstructor).link_row_related_field_id(3);

    await field.update();
    expect(field.ctor).toBeInstanceOf(link_rowConstructor);
})

test('fields:delete', async () => {
    const before = parseInt(fields.length.toString());
    await field.remove();
    await table.getFields();
    await new Promise((r) => setTimeout(r, 1000));
    expect(fields.length).toBeLessThanOrEqual(before);
})