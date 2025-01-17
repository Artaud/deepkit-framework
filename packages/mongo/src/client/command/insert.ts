/*
 * Deepkit Framework
 * Copyright (C) 2021 Deepkit UG, Marc J. Schmidt
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 *
 * You should have received a copy of the MIT License along with this program.
 */

import { BaseResponse, Command } from './command';
import { ClassSchema, ExtractClassType, getClassSchema, t } from '@deepkit/type';
import { ClassType, toFastProperties } from '@deepkit/core';

class InsertResponse extends t.extendClass(BaseResponse, {
    n: t.number,
}) {
}

const insertSchema = t.schema({
    insert: t.string,
    $db: t.string,
    lsid: t.type({ id: t.uuid }).optional,
    txnNumber: t.number.optional,
    autocommit: t.boolean.optional,
    startTransaction: t.boolean.optional,
});

export class InsertCommand<T extends ClassSchema | ClassType> extends Command {
    constructor(
        protected classSchema: T,
        protected documents: ExtractClassType<T>[]
    ) {
        super();
    }

    async execute(config, host, transaction): Promise<number> {
        const schema = getClassSchema(this.classSchema);

        const cmd: any = {
            insert: schema.collectionName || schema.name || 'unknown',
            $db: schema.databaseSchemaName || config.defaultDb || 'admin',
            documents: this.documents,
        };

        if (transaction) transaction.applyTransaction(cmd);

        const jit = schema.jit;
        let specialisedSchema = jit.mdbInsert;
        if (!specialisedSchema) {
            specialisedSchema = t.extendSchema(insertSchema, {
                documents: t.array(schema)
            });
            jit.mdbInsert = specialisedSchema;
            toFastProperties(jit);
        }

        const res = await this.sendAndWait(specialisedSchema, cmd, InsertResponse);
        return res.n;
    }

    needsWritableHost(): boolean {
        return true;
    }
}
