import {MATAL} from "./module.js";
import { MonksActiveTiles }  from '../../monks-active-tiles/monks-active-tiles.js';
import {log} from "./module.js";
export class MATALLaserAndMirrosActions {
    static RegisterAutoLanding() {
        log("Registering laser and mirrors landings");
        MATAL.RegisterAutolanding("lasers sensor", "_lasers sensor")
    }
    static RegisterActions(app) {
        log("Registering laser and mirrors actions");

    }
}