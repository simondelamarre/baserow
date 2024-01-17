import { baserow } from "../dist/index.mjs";
import credentials from "../credentials.json?raw" assert { type: "json" };
const instance = new baserow();
const connector = instance.connector(
    credentials,
    false
)
try {
    console.log('connect...')
    await connector.connect();
} catch(err) {
    throw 'unable to connect'
}
try {
    console.log('listing workspaces')
    const factory = connector.workspaces;
    await factory.list({}, {}, false); // workspaceBuilder[]
    const workspaces = factory.workspaces;
    console.log("you've ", workspaces.length, " workspaces");
} catch(err) {
    throw 'unable to list workspaces'
}
