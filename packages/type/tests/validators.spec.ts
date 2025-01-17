import { describe, expect, test } from '@jest/globals';
import 'reflect-metadata';
import { FieldDecoratorResult, t, validate } from '../index';

test('string includes', () => {
    const schema = t.schema({
        value: t.string.includes('peter')
    });

    expect(validate(schema, { value: '' })).toEqual([{ code: 'includes', message: 'Needs to include \'peter\'', path: 'value' }]);
    expect(validate(schema, { value: 'poetr' })).toEqual([{ code: 'includes', message: 'Needs to include \'peter\'', path: 'value' }]);
    expect(validate(schema, { value: 'asdadpeterasdads' })).toEqual([]);
    expect(validate(schema, { value: 'peter' })).toEqual([]);
});

test('string pattern', () => {
    const schema = t.schema({
        value: t.string.pattern(/peter/),
    });

    expect(validate(schema, { value: '' })).toEqual([{ code: 'pattern', message: 'Pattern peter does not match', path: 'value' }]);
    expect(validate(schema, { value: 'poetr' })).toEqual([{ code: 'pattern', message: 'Pattern peter does not match', path: 'value' }]);
    expect(validate(schema, { value: 'asdadpeterasdads' })).toEqual([]);
    expect(validate(schema, { value: 'peter' })).toEqual([]);
});

test('string pattern alphanumeric', () => {
    const schema = t.schema({
        value: t.string.pattern(/^[a-z]+$/),
    });

    expect(validate(schema, { value: '' })).toEqual([{ code: 'pattern', message: 'Pattern ^[a-z]+$ does not match', path: 'value' }]);
    expect(validate(schema, { value: 'poet2r' })).toEqual([{ code: 'pattern', message: 'Pattern ^[a-z]+$ does not match', path: 'value' }]);
    expect(validate(schema, { value: 'asdadpeterasdads' })).toEqual([]);
    expect(validate(schema, { value: 'peter' })).toEqual([]);
});

test('string excludes', () => {
    const schema = t.schema({
        value: t.string.excludes('peter'),
    });

    expect(validate(schema, { value: 'peter' })).toEqual([{ code: 'excludes', message: 'Needs to exclude \'peter\'', path: 'value' }]);
    expect(validate(schema, { value: 'asdadpeterasdads' })).toEqual([{ code: 'excludes', message: 'Needs to exclude \'peter\'', path: 'value' }]);
    expect(validate(schema, { value: 'poetr' })).toEqual([]);
    expect(validate(schema, { value: '' })).toEqual([]);
});

test('string minLength', () => {
    const schema = t.schema({
        value: t.string.minLength(3),
    });

    expect(validate(schema, {})).toEqual([{ code: 'required', message: 'Required value is undefined', path: 'value' }]);
    expect(validate(schema, { value: '' })).toEqual([{ code: 'minLength', message: 'Min length is 3', path: 'value' }]);
    expect(validate(schema, { value: '1' })).toEqual([{ code: 'minLength', message: 'Min length is 3', path: 'value' }]);
    expect(validate(schema, { value: '12' })).toEqual([{ code: 'minLength', message: 'Min length is 3', path: 'value' }]);
    expect(validate(schema, { value: '123' })).toEqual([]);
    expect(validate(schema, { value: '1234' })).toEqual([]);
});

test('string maxLength', () => {
    const schema = t.schema({
        value: t.string.maxLength(3),
    });

    expect(validate(schema, {})).toEqual([{ code: 'required', message: 'Required value is undefined', path: 'value' }]);
    expect(validate(schema, { value: '' })).toEqual([]);
    expect(validate(schema, { value: '1' })).toEqual([]);
    expect(validate(schema, { value: '12' })).toEqual([]);
    expect(validate(schema, { value: '123' })).toEqual([]);
    expect(validate(schema, { value: '1234' })).toEqual([{ code: 'maxLength', message: 'Max length is 3', path: 'value' }]);
    expect(validate(schema, { value: '12345' })).toEqual([{ code: 'maxLength', message: 'Max length is 3', path: 'value' }]);
});


test('string[] maxLength', () => {
    const schema = t.schema({
        value: t.array(t.string).maxLength(3),
    });

    expect(validate(schema, { value: ['a', 'b'] })).toEqual([]);
    expect(validate(schema, { value: ['a', 'b', 'c'] })).toEqual([]);
    expect(validate(schema, { value: ['a', 'b', 'c', 'd'] })).toEqual([{ code: 'maxLength', message: 'Max length is 3', path: 'value' }]);
});

test('string[] minLength', () => {
    const schema = t.schema({
        value: t.array(t.string).minLength(3),
    });

    expect(validate(schema, { value: ['a', 'b'] })).toEqual([{ code: 'minLength', message: 'Min length is 3', path: 'value' }]);
    expect(validate(schema, { value: ['a', 'b', 'c'] })).toEqual([]);
    expect(validate(schema, { value: ['a', 'b', 'c', 'd'] })).toEqual([]);
});

test('string[] minLength deep', () => {
    const schema = t.schema({
        value: t.array(t.string.minLength(3)).minLength(3),
    });

    expect(validate(schema, { value: ['a', 'b'] })).toEqual([
        { code: 'minLength', message: 'Min length is 3', path: 'value.1' },
        { code: 'minLength', message: 'Min length is 3', path: 'value.0' },
        { code: 'minLength', message: 'Min length is 3', path: 'value' },
    ]);
    expect(validate(schema, { value: ['a', 'b', 'c'] })).toEqual([
        { code: 'minLength', message: 'Min length is 3', path: 'value.2' },
        { code: 'minLength', message: 'Min length is 3', path: 'value.1' },
        { code: 'minLength', message: 'Min length is 3', path: 'value.0' },
    ]);
    expect(validate(schema, { value: ['abc', 'abc', 'abc'] })).toEqual([]);
    expect(validate(schema, { value: ['abc', 'abc', 'abc', 'abc'] })).toEqual([]);
});

test('number max', () => {
    const schema = t.schema({
        value: t.number.maximum(3),
    });

    expect(validate(schema, {})).toEqual([{ code: 'required', message: 'Required value is undefined', path: 'value' }]);
    expect(validate(schema, { value: '' })).toEqual([{ code: 'invalid_number', message: 'No number given', path: 'value' }]);
    expect(validate(schema, { value: 1 })).toEqual([]);
    expect(validate(schema, { value: 2 })).toEqual([]);
    expect(validate(schema, { value: 3 })).toEqual([]);
    expect(validate(schema, { value: 4 })).toEqual([{ code: 'maximum', message: 'Number needs to be smaller than or equal to 3', path: 'value' }]);
    expect(validate(schema, { value: 123123123 })).toEqual([{ code: 'maximum', message: 'Number needs to be smaller than or equal to 3', path: 'value' }]);
});


test('number max exclusive', () => {
    const schema = t.schema({
        value: t.number.exclusiveMaximum(3),
    });

    expect(validate(schema, {})).toEqual([{ code: 'required', message: 'Required value is undefined', path: 'value' }]);
    expect(validate(schema, { value: '' })).toEqual([{ code: 'invalid_number', message: 'No number given', path: 'value' }]);
    expect(validate(schema, { value: 1 })).toEqual([]);
    expect(validate(schema, { value: 2 })).toEqual([]);
    expect(validate(schema, { value: 3 })).toEqual([{ code: 'maximum', message: 'Number needs to be smaller than 3', path: 'value' }]);
    expect(validate(schema, { value: 4 })).toEqual([{ code: 'maximum', message: 'Number needs to be smaller than 3', path: 'value' }]);
    expect(validate(schema, { value: 123123123 })).toEqual([{ code: 'maximum', message: 'Number needs to be smaller than 3', path: 'value' }]);
});


test('number min', () => {
    const schema = t.schema({
        value: t.number.minimum(3),
    });

    expect(validate(schema, {})).toEqual([{ code: 'required', message: 'Required value is undefined', path: 'value' }]);
    expect(validate(schema, { value: '' })).toEqual([{ code: 'invalid_number', message: 'No number given', path: 'value' }]);
    expect(validate(schema, { value: 1 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than or equal to 3', path: 'value' }]);
    expect(validate(schema, { value: 2 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than or equal to 3', path: 'value' }]);
    expect(validate(schema, { value: 3 })).toEqual([]);
    expect(validate(schema, { value: 4 })).toEqual([]);
    expect(validate(schema, { value: 123123123 })).toEqual([]);
});


test('number min exclusive', () => {
    const schema = t.schema({
        value: t.number.exclusiveMinimum(3),
    });

    expect(validate(schema, {})).toEqual([{ code: 'required', message: 'Required value is undefined', path: 'value' }]);
    expect(validate(schema, { value: '' })).toEqual([{ code: 'invalid_number', message: 'No number given', path: 'value' }]);
    expect(validate(schema, { value: 1 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than 3', path: 'value' }]);
    expect(validate(schema, { value: 2 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than 3', path: 'value' }]);
    expect(validate(schema, { value: 3 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than 3', path: 'value' }]);
    expect(validate(schema, { value: 4 })).toEqual([]);
    expect(validate(schema, { value: 123123123 })).toEqual([]);
});

test('number min/max', () => {
    const schema = t.schema({
        value: t.number.minimum(3).maximum(10),
    });

    expect(validate(schema, { value: 1 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than or equal to 3', path: 'value' }]);
    expect(validate(schema, { value: 2 })).toEqual([{ code: 'minimum', message: 'Number needs to be greater than or equal to 3', path: 'value' }]);
    expect(validate(schema, { value: 3 })).toEqual([]);
    expect(validate(schema, { value: 4 })).toEqual([]);
    expect(validate(schema, { value: 9 })).toEqual([]);
    expect(validate(schema, { value: 10 })).toEqual([]);
    expect(validate(schema, { value: 11 })).toEqual([{ code: 'maximum', message: 'Number needs to be smaller than or equal to 10', path: 'value' }]);
});


test('number positive', () => {
    const schema = t.schema({
        value: t.number.positive(),
    });

    expect(validate(schema, { value: -1 })).toEqual([{ code: 'positive', message: 'Number needs to be positive', path: 'value' }]);
    expect(validate(schema, { value: 0 })).toEqual([]);
    expect(validate(schema, { value: 1 })).toEqual([]);
    expect(validate(schema, { value: 2 })).toEqual([]);
});


test('number positive includingZero', () => {
    const schema = t.schema({
        value: t.number.positive(false),
    });

    expect(validate(schema, { value: -1 })).toEqual([{ code: 'positive', message: 'Number needs to be positive', path: 'value' }]);
    expect(validate(schema, { value: 0 })).toEqual([{ code: 'positive', message: 'Number needs to be positive', path: 'value' }]);
    expect(validate(schema, { value: 1 })).toEqual([]);
    expect(validate(schema, { value: 2 })).toEqual([]);
});



test('number negative', () => {
    const schema = t.schema({
        value: t.number.negative(),
    });

    expect(validate(schema, { value: 1 })).toEqual([{ code: 'negative', message: 'Number needs to be negative', path: 'value' }]);
    expect(validate(schema, { value: 0 })).toEqual([]);
    expect(validate(schema, { value: -1 })).toEqual([]);
    expect(validate(schema, { value: -2 })).toEqual([]);
});


test('number negative includingZero', () => {
    const schema = t.schema({
        value: t.number.negative(false),
    });

    expect(validate(schema, { value: 1 })).toEqual([{ code: 'negative', message: 'Number needs to be negative', path: 'value' }]);
    expect(validate(schema, { value: 0 })).toEqual([{ code: 'negative', message: 'Number needs to be negative', path: 'value' }]);
    expect(validate(schema, { value: -1 })).toEqual([]);
    expect(validate(schema, { value: -2 })).toEqual([]);
});


test('number multipleOf', () => {
    const schema = t.schema({
        value: t.number.multipleOf(10),
    });

    expect(validate(schema, { value: -10 })).toEqual([]);
    expect(validate(schema, { value: 0 })).toEqual([]);
    expect(validate(schema, { value: 10 })).toEqual([]);
    expect(validate(schema, { value: 1 })).toEqual([{ code: 'multipleOf', message: 'Not a multiple of 10', path: 'value' }]);
    expect(validate(schema, { value: 22 })).toEqual([{ code: 'multipleOf', message: 'Not a multiple of 10', path: 'value' }]);
});

describe('validators', () => {
    type Errors = {code?: string, message?: string}[];
    const tests: [type: FieldDecoratorResult<any>, value: any, errors: Errors][] = [
        [t.number, 123, []],
        [t.number, '123', [{code: 'invalid_number'}]],
        [t.string, '123', []],
        [t.string, 123, [{code: 'invalid_string'}]],
        [t.string.decimal(), '123.0', []],
        [t.string.decimal(), '123', [{code: 'decimal'}]],
        [t.string.decimal(10), '123.1234567890', []],
        [t.string.decimal(0, 3), '123.1', []],
        [t.string.decimal(0, 3), '123.12', []],
        [t.string.decimal(0, 3), '123.123', []],
        [t.string.decimal(0, 3), '123.1234', [{code: 'decimal'}]],
        [t.string.alpha(), 'abc', []],
        [t.string.alpha(), 'abc2', [{code: 'alpha'}]],
        [t.string.alpha(), '34', [{code: 'alpha'}]],
        [t.string.alpha(), '', []],
        [t.string.alphanumeric(), 'abc', []],
        [t.string.alphanumeric(), '123', []],
        [t.string.alphanumeric(), 'abc123', []],
        [t.string.alphanumeric(), 'abc123$', [{code: 'alphanumeric'}]],
        [t.string.alphanumeric(), '', []],
        [t.string.alphanumeric(), ' ', [{code: 'alphanumeric'}]],
        [t.string.ascii(), ' ', []],
        [t.string.ascii(), '1234abcdCBBZ', []],
        [t.string.ascii(), '!@#$%^&*()', []],
        [t.string.ascii(), '😱', [{code: 'ascii'}]],
        [t.string.dataURI(), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', []],
        [t.string.dataURI(), 'data:text/html;charset=utf-8,<!DOCTYPE%20html><html%20lang%3D"en"><head><title>Embedded%20Window<%2Ftitle><%2Fhead><body><h1>42<%2Fh1><%2Fbody><%2Fhtml>', []],
        [t.string.dataURI(), 'data:image/svg+xml;base64', [{code: 'dataURI'}]],
        [t.string.dataURI(), 'data:image/svg+xml;PD94bWwgdmVyzeiBNMyw2djJoMThWNkgzeiIvPjwvZz4KPC9zdmc+Cgo=', [{code: 'dataURI'}]],
        [t.string.dataURI(), 'data:image;base64,PD94bWwgdmVyzeiBNMyw2djJoMThWNkgzeiIvPjwvZz4KPC9zdmc+Cgo=', []],
        [t.string.dataURI(), 'data:', [{code: 'dataURI'}]],
        [t.string.dataURI(), 'data:', [{code: 'dataURI'}]],
        [t.string.dataURI(), '12345', [{code: 'dataURI'}]],
    ];

    for (let i = 0; i < tests.length; i++) {
        const [decorator, value, expectedErrors] = tests[i];
        const property = decorator.buildPropertySchema('test_' + i);

        test(`types round-trip #${i} ${property.toString()} ${property.validatorsToString()}: ${value}`, () => {
            const s = t.schema({
                v: decorator
            });

            const errors = validate(s, { v: value });
            expect(errors).toMatchObject(expectedErrors);
        });
    }
});
