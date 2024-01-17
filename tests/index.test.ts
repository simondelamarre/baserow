import { baserow } from '../src';

test('create an instance', () => {
    const sdk = new baserow();
    expect(sdk).toBeInstanceOf(baserow); 
});