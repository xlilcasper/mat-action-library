import { MonksActiveTiles, i18n }  from '../../monks-active-tiles/monks-active-tiles.js';
import { MATALActionManager } from "./actions.js";

export let log = (...args) => console.log("MATAL | ", ...args);
export let debug = (...args) => {
  if (MATAL.log_level >= MATAL.log_levels.DEBUG)
    console.log("MATAL | ", ...args);
}
export let info = (...args) => {
  if (MATAL.log_level >= MATAL.log_levels.INFO)
    console.log("MATAL | ", ...args);
}
export let warn = (...args) => {
  if (MATAL.log_level >= MATAL.log_levels.WARNING)
    console.warn("MATAL | ", ...args)
}
export let error = (...args) => {
  if (MATAL.log_level >= MATAL.log_levels.ERROR)
    console.error("MATAL | ", ...args)
}
export let critical = (...args) => {
  if (MATAL.log_level >= MATAL.log_levels.CRITICAL)
    console.error("MATAL | ", ...args)
}

export class MATAL {
  static get log_levels() {
    return {
      NONSET: 0,
      DEBUG: 10,
      INFO: 20,
      WARNING: 30,
      ERROR: 40,
      CRITICAL: 50
    };
  };
  static log_level = MATAL.log_levels.DEBUG;
  static auto_landings = {}
  static RegisterAutolanding(method, landing) {
    this.auto_landings[method] = landing;
  }
}
Hooks.once('init', async function() {
  console.log(" .----------------. .----------------. .----------------. .----------------. .----------------. ");
  console.log("| .--------------. | .--------------. | .--------------. | .--------------. | .--------------. |");
  console.log("| | ____    ____ | | |      __      | | |  _________   | | |      __      | | |   _____      | |");
  console.log("| ||_   \\  /   _|| | |     /  \\     | | | |  _   _  |  | | |     /  \\     | | |  |_   _|     | |");
  console.log("| |  |   \\/   |  | | |    / /\\ \\    | | | |_/ | | \\_|  | | |    / /\\ \\    | | |    | |       | |");
  console.log("| |  | |\\  /| |  | | |   / ____ \\   | | |     | |      | | |   / ____ \\   | | |    | |   _   | |");
  console.log("| | _| |_\\/_| |_ | | | _/ /    \\ \\_ | | |    _| |_     | | | _/ /    \\ \\_ | | |   _| |__/ |  | |");
  console.log("| ||_____||_____|| | ||____|  |____|| | |   |_____|    | | ||____|  |____|| | |  |________|  | |");
  console.log("| |              | | |              | | |              | | |              | | |              | |");
  console.log("| '--------------' | '--------------' | '--------------' | '--------------' | '--------------' |");
  console.log(" '----------------' '----------------' '----------------' '----------------' '----------------' ");
});

Hooks.once('ready', async function() {
  log("MAT Action Library READY");
});

Hooks.on("setupTileActions", (app) => {
  log("Wrap our trigger modes");
  let originaltriggerModes = Reflect.get(MonksActiveTiles, 'triggerModes');


  Object.defineProperty(MonksActiveTiles, "triggerModes", {
    get: function() {
      let out = {}
      for (let key in originaltriggerModes) {
        out[key] = i18n(originaltriggerModes[key]);
      }
      out = mergeObject(out, MATAL.auto_landings)
      return out;
    }
  });
  MATALActionManager.RegisterAutoLanding();
  MATALActionManager.RegisterActions(app)
});
