// deno-lint-ignore-file no-unused-vars camelcase ban-unused-ignore
import { readerFromStreamReader, copy, logger } from "./deps.ts";

const BASE = "https://api.github.com"
const ACCEPT_HEADER = "application/vnd.github.v3+json"

export type Asset = {
    url: string
    browser_download_url: string
    id: number
    node_id: string
    name: string
    label: string
    state: string
    content_type: string
    size: number
    download_count: number
    created_at: string
    updated_at: string
}

export type Release = {
    url: string
    html_url: string
    assets_url: string
    upload_url: string
    tarball_url: string
    zipball_url: string
    discussion_url: string
    id: number
    node_id: string
    tag_name: string
    target_commitish: string
    name: string
    body: string
    draft: boolean
    prerelease: boolean
    created_at: string
    published_at: string
    assets: Asset[]
}

async function request(token: string, paths: string) {
    const req = await fetch(`${BASE}/${paths}`, {
        headers: {
            "Accept": ACCEPT_HEADER,
            "Authorization": `token ${token}`
        }
    })

    return await req.json()
}

async function getLatestRelease(token: string, actor: string, repo: string): Promise<Release> {
    logger.info(`Fetching latest release from '${actor}/${repo}'`)
    return await request(token, `repos/${actor}/${repo}/releases/latest`) as Release
}

async function downloadAsset(token: string, release: Release, asset: Asset) {
    const url = asset.url

    logger.info(`Asset with name '${asset.name}' from release '${release.name}' will be downloaded`)
    logger.info(`Download url is '${url}'`)
    
    const res = await fetch(url, {
        headers: {
            "Accept": "application/octet-stream",
            "Authorization": `token ${token}`
        }
    })

    const body = res.body

    if (!body) throw new Error("Received empty body from "+url)

    logger.info(`Downloading asset '${asset.name}'...`)
    const reader = readerFromStreamReader(body.getReader())

    const file = await Deno.open(`./${asset.name}`, { create: true, write: true })

    await copy(reader, file)

    file.close()
    logger.info(`${asset.name} has been downloaded successfuly!`)
}

export async function start(token: string, actor: string, repo: string, artifactName: string) {
    const release = await getLatestRelease(token, actor, repo)
    
    const asset = release.assets.find((r) => r.name === artifactName)

    if (!asset) throw new Error("Cannot get artifact with name " + artifactName + " for release "+release.name)

    downloadAsset(token, release, asset)
}