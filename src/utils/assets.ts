import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import chunk from 'lodash/chunk'
import yaml from 'js-yaml'
import { DEBUG } from '../config'
import assets from '../data/assets'
import * as Types from '../types'
import { getCopticDate, getGeorgianDate } from './date'

const ASSET_DIRECTORY = FileSystem.documentDirectory + 'assets'

const getAssetPath = (path: string) => `${ASSET_DIRECTORY}/${path}`

export const loadFile = async (filepath: string) => {
    const fullPath = getAssetPath(filepath)
    if (DEBUG) console.log(`[loading] file ${fullPath}`)

    try {
        const dictString = await FileSystem.readAsStringAsync(fullPath)
        return yaml.load(dictString) as any
    } catch (error) {
        console.error(error)
        return
    }
}

type LoadFileResult = { path: string; content: Types.JsonSchema; metadata: undefined }
type LoadDirectoryResult = { path: string; content: (LoadFileResult | LoadDirectoryResult)[]; metadata?: { title: Types.MultiLingualText } }
const isLoadDirectoryResultT = (result: LoadFileResult | LoadDirectoryResult): result is LoadDirectoryResult => !result.path.endsWith('.yml')

export const loadDirectory = async (directory: string): Promise<LoadDirectoryResult | undefined> => {
    const fullPath = getAssetPath(directory)
    if (DEBUG) console.log(`[loading] directory ${fullPath}`)

    try {
        const files = (await FileSystem.readDirectoryAsync(fullPath)).sort()

        const output: (LoadFileResult | LoadDirectoryResult)[] = []
        for (const file of files) {
            const filepath = `${directory}/${file}`
            if (await isDirectory(getAssetPath(filepath))) {
                const subDir = await loadDirectory(filepath)
                if (subDir) output.push(subDir)
            } else if (filepath.match(/\d{2}\-.+\.yml/)) {
                output.push({
                    path: filepath,
                    content: await loadFile(filepath),
                })
            }
        }

        return {
            path: directory,
            content: output,
            metadata: await loadFile(`${directory}/index.yml`), //
        }
    } catch (error) {
        console.error(error)
        return
    }
}

type Section = NonNullable<Types.Prayer['sections']>[number]
const isOccasion = (occasion: Types.Occasion) => (prayerOrSection: Types.Prayer | Section) =>
    !prayerOrSection?.occasion || prayerOrSection?.occasion === occasion

const filename = (path?: string) => path?.split('/').pop()
const dirname = (path: string) => path.split('/').slice(0, -1).join('/')

export type PrayerWithId = Types.Prayer & { id: string }
export type PrayerGroup = {
    metadata?: { title?: Types.MultiLingualText }
    prayers: PrayerWithId[]
}

const parsePrayerGroup = (result: LoadDirectoryResult, occasion: Types.Occasion) => {
    const { content, ...rest } = result

    return {
        ...rest,
        prayers: content
            ?.filter(({ path }: { path: string }) => filename(path)?.match(/\d{2}-/))
            ?.map(({ path, content }) => ({ ...content, id: filename(path)?.replace('.yml', '') }) as PrayerWithId)
            ?.filter(isOccasion(occasion))
            ?.map((prayer) => ({ ...prayer, sections: prayer?.sections?.filter(isOccasion(occasion)) })),
    }
}

export const loadPrayer = async (path: string, occasion: Types.Occasion): Promise<PrayerGroup[]> => {
    const result = await loadDirectory(`coptish-datastore/output/${path}`)
    if (!result) return []

    if (isLoadDirectoryResultT(result.content[0])) {
        return result.content.map((r) => parsePrayerGroup(r as LoadDirectoryResult, occasion))
    } else {
        return [parsePrayerGroup(result, occasion)]
    }
}

type ReadingType = Types.ReadingSection['readingType']
export const loadReading = async (date: Date, type: ReadingType): Promise<Types.Reading | Types.Synaxarium> => {
    const filename = type === 'synaxarium' ? getCopticDate(date, 'iso') : getGeorgianDate(date, 'iso')
    return await loadFile(`coptish-datastore/output/readings/${type}/${filename}.yml`)
}

const isExist = async (path: string) => {
    const { exists } = await FileSystem.getInfoAsync(path)
    return exists
}

const isDirectory = async (path: string) => {
    const { exists, isDirectory } = await FileSystem.getInfoAsync(path)
    return exists && isDirectory
}

export const initCoptishDatastore = async (callback?: (currentAsset: string) => void) => {
    const concurrencyLimit = 5
    const assetChunks = chunk(assets, concurrencyLimit)

    let i = 0
    for (const chunk of assetChunks) {
        await Promise.all(
            chunk.map(async ({ path, module }) => {
                if (path.includes('readings/')) return // TODO: remove
                const targetPath = getAssetPath(path)

                if (DEBUG) {
                    const message = `[copying ${i}/${assets.length}] ${path}`
                    console.log(message)
                    callback?.(message)
                    i += 1
                }

                const [{ localUri: sourcePath }] = await Asset.loadAsync(module)
                if (!sourcePath) return

                try {
                    const sourceInfo = await FileSystem.getInfoAsync(sourcePath, { md5: true })
                    const targetInfo = await FileSystem.getInfoAsync(targetPath, { md5: true })

                    if (targetInfo.exists && sourceInfo.exists && targetInfo.md5 === sourceInfo.md5) return
                } catch (error) {
                    console.error(error)
                }

                const dirPath = dirname(targetPath)
                try {
                    if (DEBUG) console.log(`[checking directory] ${dirPath} isExist:${await isExist(dirPath)}`)
                    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true })
                } catch (error) {
                    console.error(error)
                }

                try {
                    await FileSystem.copyAsync({ from: sourcePath, to: targetPath })
                } catch (error) {
                    console.error(error)
                }
                if (DEBUG) console.log(`[checking file] ${targetPath} isExist:${await isExist(targetPath)}`)
                if (DEBUG) console.log(`[checking directory] ${dirPath} isExist:${await isExist(dirPath)}`)
            }),
        )
    }
}

export const clearAssets = async () => {
    const files = await FileSystem.readDirectoryAsync(getAssetPath(''))
    await Promise.all(files.map((file) => FileSystem.deleteAsync(getAssetPath(file))))

    if (DEBUG) console.log(`[clear] ${ASSET_DIRECTORY}`)
}

export const initAssets = async (callback?: (currentAsset: string) => void) => {
    await initCoptishDatastore(callback)
}

export const treeAssets = async (path = 'coptish-datastore', indent = 0) => {
    let string = ''
    string += '\t'.repeat(indent) + filename(path) + '\n'
    const files = (await FileSystem.readDirectoryAsync(getAssetPath(path))).sort()
    for (const file of files) {
        const filepath = `${path}/${file}`
        if (await isDirectory(getAssetPath(filepath))) string += await treeAssets(filepath, indent + 1)
        else string += '\t'.repeat(indent + 2) + '- ' + filename(filepath) + '\n'
    }
    return string
}
