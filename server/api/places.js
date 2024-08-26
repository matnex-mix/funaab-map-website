import {Artifact} from "~/server/models/artifacts.model.js";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const dbQuery = {};

    if( query.search ){
        dbQuery.$text = {
            $search: query.search
        };
    }

    const artifacts = await Artifact.find(dbQuery);

    return artifacts;
})