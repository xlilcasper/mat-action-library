import {MATAL} from "./module.js";
import { MonksActiveTiles }  from '../../monks-active-tiles/monks-active-tiles.js';
import {log} from "./module.js";
export class MATALTaggerActions {
    static RegisterAutoLanding() {
        log("Registering tagger landings");
    }
    static RegisterActions(app) {
        log("Registering tagger actions");
        app.registerTileAction('mat-action-library', 'has_tag', {
                name: 'MATAL.filter_has_tag',
                ctrls: [
                    {
                        id: "entity",
                        name: "MonksActiveTiles.ctrl.select-entity",
                        type: "select",
                        subtype: "entity",
                        onChange: (app) => {
                            app.checkConditional();
                        },
                        options: {
                            showToken: true,
                            showTile: true,
                            showWithin: true,
                            showPlayers: true,
                            showPrevious: true,
                            showTagger: true
                        },
                        restrict: (entity) => {
                            return (entity instanceof Token ||
                                entity instanceof Tile ||
                                entity instanceof Drawing ||
                                entity instanceof Note ||
                                entity instanceof AmbientLight ||
                                entity instanceof AmbientSound ||
                                entity instanceof Wall ||
                                entity.terrain != undefined);
                        }
                    },
                    {
                        id: "collection",
                        name: "Collection",
                        list: "collection",
                        type: "list",
                        onChange: (app, ctrl, action, data) => {
                            $('input[name="data.entity"]', app.element).next().html('Current collection of ' + $(ctrl).val());
                        },
                        conditional: (app) => {
                            let entity = JSON.parse($('input[name="data.entity"]', app.element).val() || "{}");
                            return entity?.id == 'previous';
                        },
                        defvalue: 'tokens'
                    },
                    {
                        id: "tag",
                        name: "MATAL.tag",
                        type: "text",
                        required: true
                    },
                ],
                values: {
                    'collection': {
                        'actors': "Actors",
                        'items': "Items",
                        'journal': "Journal Entries",
                        'tokens': "Tokens",
                        'walls': "Walls"
                    }
                },
                group: "mat-action-library",
                fn: async (args = {}) => {
                    let {action, value, tokens, tile, method, change} = args;

                    let entities = await MonksActiveTiles.getEntities(args, action.data?.collection || "tokens");

                    let result = entities.filter(entity => {
                        let tag = action.data.tag;
                        console.log(entity)
                        console.log(entity.flags.tagger)
                        return entity.flags.tagger.tags.includes(tag)
                    });

                    let retval = {};
                    retval[action.data?.collection || "tokens"] = result;
                    return retval;
                },
                content: async (trigger, action) => {
                    let entityName = await MonksActiveTiles.entityName(action.data?.entity, action.data?.collection);
                    return `<span class="filter-style">Find</span> <span class="entity-style">${entityName}</span> with tag <span class="value-style">&lt;${action.data?.tag}&gt;</span>`;
                }
            });
        app.registerTileAction('mat-action-library', 'find_tag', {
                name: 'MATAL.find_tag',
                ctrls: [
                    {
                        id: "tag",
                        name: "MATAL.tag",
                        type: "text",
                        required: true
                    },
                ],
                values: {},
                group: "mat-action-library",
                fn: async (args = {}) => {
                    let {action} = args;
                    let result = Tagger.getByTag(action.data.tag)
                    console.log("Result")
                    console.log(result)
                    return {tokens: result};
                },
                content: async (trigger, action) => {
                    return `<span class="action-style">Find by tag</span> <span class="detail-style">"${action.data.tag}"</span>`;
                }
            });
    }
}