import {defineMongooseModel} from "#nuxt/mongoose";

export const Artifact = defineMongooseModel({
    name: 'Artifact',
    schema: {
        title: { type: 'string' },
        description: { type: 'string' }
    },
    options: {

    },
    hooks(schema) {

    },
})