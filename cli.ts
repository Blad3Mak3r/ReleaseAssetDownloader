import { logger, parse } from "./deps.ts";
import { start } from "./github.ts";

type Arguments = {
    t?: string
    u?: string
    r?: string
    a?: string
}

(async () => {
    logger.info("Starting GitHub Release Artifact downloader")

    const args = parse(Deno.args) as Arguments

    const token = args.t
    const actor = args.u
    const repo = args.r
    const artifact = args.a

    if (!token) throw new Error("token is not present (use -t token)")
    if (!actor) throw new Error("actor is not present (use -u user)")
    if (!repo) throw new Error("repo is not present (user -r repo)")
    if (!artifact) throw new Error("artifact is not present (use -a artifact)")

    await start(token, actor,repo, artifact)
})()