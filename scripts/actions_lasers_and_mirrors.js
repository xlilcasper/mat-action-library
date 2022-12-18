import {MATAL} from "./module.js";
import { MonksActiveTiles, i18n }  from '../../monks-active-tiles/monks-active-tiles.js';
import {log} from "./module.js";
export class MATALLaserAndMirrosActions {
    static RegisterAutoLanding() {
        log("Registering laser and mirrors landings");
        MATAL.RegisterAutolanding("lasers sensor", "_lasers sensor")
    }
    static RegisterActions(app) {
        log("Registering laser and mirrors actions");
        app.registerTileAction('mat-action-library', 'set_laser_active', {
            name: "MATAL.set_laser_active",
            requiresGM: true,
            batch: true,
            options: {allowDelay: true},
            ctrls: [
                {
                    id: "entity",
                    name: "MonksActiveTiles.ctrl.select-entity",
                    type: "select",
                    subtype: "entity",
                    options: {
                        showToken: true,
                        showPrevious: true,
                        showTagger: true
                    }
                },
                {
                    id: "value",
                    name: "MATAL.Active",
                    type: "checkbox",
                    defvalue: true
                },
            ],
            fn: async (args = {}) => {
                const {tile, tokens, action, userid, value, method, change} = args;
                let entities = await MonksActiveTiles.getEntities(args, action.data?.collection || "tokens");
                let result = entities;
                if (entities && entities.length > 0) {
                    for (let entity of entities) {
                        console.log(entity);
                        let update = {}
                        if (entity) {
                            update["flags.lasers.is_lamp"] = action.data.value
                        }
                        MonksActiveTiles.batch.add('update', entity, update);
                    }
                }
                let retval = {};
                retval[action.data?.collection || "tokens"] = result;
                return retval;
            },
            content: async (trigger, action) => {
                let entityName = await MonksActiveTiles.entityName(action.data?.entity, 'journal');
                return `<span class="action-style">${i18n(trigger.name)}</span> <span class="entity-style">${entityName}</span> ${(action.data?.value ? ' True' : ' False ')}`;
            }
        });
    }
}