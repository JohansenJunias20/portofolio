import Config from "./config.common";

const prodConfig = {
    ...Config,
    debug: false,
    sun_helper: false
}

export default prodConfig;