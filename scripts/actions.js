import {MATAL} from "./module.js";
import { MonksActiveTiles, i18n }  from '../../monks-active-tiles/monks-active-tiles.js';
import { MATALTaggerActions } from "./actions_tagger.js";
import {MATALLaserAndMirrosActions} from "./actions_lasers_and_mirrors.js";
import {log} from "./module.js";


export class MATALActionManager {
    static RegisterAutoLanding() {
        log("Registering landings");
        MATAL.RegisterAutolanding("reset", "_reset")
        if (game.modules.get('tagger')?.active) {
            MATALTaggerActions.RegisterAutoLanding()
        }
        if (game.modules.get('laser-and-mirrors')?.active) {
            MATALLaserAndMirrosActions.RegisterAutoLanding();
        }
    }
    static RegisterActions (app) {
        log("Registering actions");
        app.registerTileGroup('mat-action-library', "MATAL");
        app.registerTileAction('mat-action-library', 'console_log', {
            name: 'MATAL.Console_Log',
            ctrls: [
                {
                    id: "msg",
                    name: "Message",
                    type: "text",
                    required: true
                },
            ],
            values: {
            },
            group: 'mat-action-library',
            fn: async (args = {}) => {
                let { action, userid, value, tokens, tile, method, change } = args;
                let entities = await MonksActiveTiles.getEntities(args);
                let context = {
                    actor: tokens[0]?.actor?.toObject(false),
                    token: tokens[0]?.toObject(false),
                    user: game.users.get(userid),
                    entities: entities,
                    message: action.data.msg,
                    scene: canvas.scene,
                    method: method,
                    change: change
                };
                const compiled = Handlebars.compile(action.data.msg);
                let msg = compiled(context, { allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault: true }).trim();
                console.log(msg)
                return {};
            },
            content: async (trigger, action) => {
                let msg = action.data.msg.length <= 15 ? action.data.msg : action.data.msg.substr(0, 15) + "...";
                return `<span class="action-style">Console Log</span> <span class="detail-style">"${msg}"</span>`;
            }
        });
        app.registerTileAction('mat-action-library', "tile_distance", {
            name: "MATAL.Filter_Tile_Center_Distance",
            ctrls: [
                {
                    id: "entity",
                    name: "MonksActiveTiles.ctrl.select-entity",
                    type: "select",
                    subtype: "entity",
                    options: { showTile: true, showTagger: true },
                    restrict: (entity) => {
                        return (entity instanceof Tile);
                    }
                },
                {
                    id: "measure",
                    name: "Measure",
                    list: "measure",
                    type: "list",
                    onChange: (app) => {
                        app.checkConditional();
                    },
                    defvalue: 'lte'
                },
                {
                    id: "distance",
                    name: "MonksActiveTiles.ctrl.distance",
                    type: "number",
                    required: true,
                    variation: 'unit',
                    conditional: (app) => {
                        return $('select[name="data.measure"]', app.element).val() != 'lt';
                    },
                    defvalue: 1
                },
                {
                    id: "continue",
                    name: "Continue if",
                    list: "continue",
                    type: "list",
                    defvalue: 'within'
                }
            ],
            values: {
                'measure': {
                    'lt': "inside tile",
                    'lte': "less than",
                    'gt': "greater than"
                },
                'continue': {
                    "always": "Always",
                    "within": "Any Within Distance",
                    "all": "All Within Distance"
                },
                'unit': {
                    'sq': "grid sq.",
                    'px': "pixel"
                }
            },
            group: "mat-action-library",
            fn: async (args = {}) => {
                const {tile, value, action} = args;

                let midTile = {x: tile.x + (Math.abs(tile.width) / 2), y: tile.y + (Math.abs(tile.height) / 2)};
                let entities = await MonksActiveTiles.getEntities(args);


                let tiles = entities.filter(t => {
                    // Filter out everything that is not a tile
                    if (!(t instanceof TileDocument))
                        return false;
                    // Get the center of our tile as the x,y is the corner.
                    const hW = (Math.abs(t.width)  / 2);
                    const hH = (Math.abs(t.height) / 2);
                    const midCheckTile = {x: t.x + hW, y: t.y + hH};

                    if (action.data.measure == 'lt') {
                        console.log(tile)
                        console.log(midCheckTile)
                        return tile.pointWithin(midCheckTile)
                    }

                    //parse our distance to an int.
                    let distance = parseInt(action.data?.distance.value || action.data?.distance || 0);
                    // If our distance is in squares, multiply by our grid size
                    if (action.data.distance.var == 'sq')
                        distance = (t.parent.grid.size * distance);

                    const dist = Math.hypot(midTile.x - midCheckTile.x, midTile.y - midCheckTile.y );
                    return (action.data.measure == 'lte' ? dist < distance : dist < distance)
                });

                let cont = (action.data?.continue == 'always'
                    || (action.data?.continue == 'within' && tiles.length > 0)
                    || (action.data?.continue == 'all' && tiles.length == value["tokens"].length && tiles.length > 0));
                return {continue: cont, tokens: tiles};
            },
            content: async (trigger, action) => {
                let unit = (action.data.distance.var == 'sq' ? 'grid square' : 'pixels');
                let entityName = await MonksActiveTiles.entityName(action.data?.entity);
                return `<span class="filter-style">Filter</span> <span class="entity-style">${entityName}</span> ${action.data.measure != 'lte' ? 'by a distance' : 'that are'} <span class="entity-style">${trigger.values.measure[action.data.measure || 'eq']}</span>${(action.data.measure != 'lt' ? ` <span class="details-style">"${action.data?.distance.value || action.data?.distance || 0}"</span> ${unit} of this Tile` : '')} ${(action.data?.continue != 'always' ? ', Continue if ' + (action.data?.continue == 'within' ? 'Any Within Distance' : 'All Within Distance') : '')}`;
            }
        });
        app.registerTileAction('mat-action-library', "reset_tile", {
            name: "MATAL.reset",
            options: { allowDelay: true },
            ctrls: [
                {
                    id: "entity",
                    name: "MonksActiveTiles.ctrl.select-tile",
                    type: "select",
                    subtype: "entity",
                    required: true,
                    options: { showTile: true, showTagger: true, showPrevious: true },
                    restrict: (entity) => { return (entity instanceof Tile); },
                    defaultType: 'tiles',
                    placeholder: "Please select a Tile"
                },
            ],
            fn: async (args = {}) => {
                const { tile, userid, action, method } = args;
                let entities = await MonksActiveTiles.getEntities(args, 'tiles');
                log(entities);
                if (entities.length == 0)
                    return;
                let tokens = await MonksActiveTiles.getEntities(args, "tokens", (action.data?.token || { id: "previous" }));
                let promises = [];
                for (let entity of entities) {
                    if (!(entity instanceof TileDocument))
                        continue;

                    let newargs = Object.assign({}, args, { tokens: tokens, tile: entity, method: "reset" });
                    promises.push(entity.trigger.call(entity, newargs));

                }

                return Promise.all(promises).then((results) => {
                    if (action.data.return === false)
                        return;

                    let value = {};
                    for (let result of results) {
                        mergeObject(value, result.value);
                    }
                    return value;
                });
            },
            content: async (trigger, action) => {
                let entityName = await MonksActiveTiles.entityName(action.data?.entity, 'tiles');
                return `<span class="action-style">${i18n(trigger.name)}</span>, <span class="entity-style">${entityName}</span>`;
            }
        });
        if (game.modules.get('tagger')?.active) {
            MATALTaggerActions.RegisterActions(app)
        }
        if (game.modules.get('laser-and-mirrors')?.active) {
            MATALLaserAndMirrosActions.RegisterActions(app)
        }
    }
}
