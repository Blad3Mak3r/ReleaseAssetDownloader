export { parse } from "https://deno.land/std@0.113.0/flags/mod.ts"
export { readerFromStreamReader, copy } from "https://deno.land/std@0.113.0/streams/mod.ts";
import * as log from "https://deno.land/std@0.113.0/log/mod.ts";

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("INFO")
    }
})

export const logger = log.getLogger()
