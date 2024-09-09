import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'
import { Asset } from 'expo-asset'
import yaml from 'js-yaml'
import { DEBUG } from '../config'
import assets from '../data/assets'
import * as Types from '../types'
import { getCopticDate, getGeorgianDate } from './date'

const ASSET_DIRECTORY = FileSystem.documentDirectory + 'assets'

const getAssetPath = (path: string) => `${ASSET_DIRECTORY}/${path}`

export const loadFile = async (filepath: string) => {
    const fullPath = getAssetPath(filepath)
    DEBUG && console.log(`[loading] file ${fullPath}`)

    try {
        const dictString = await FileSystem.readAsStringAsync(fullPath)
        return yaml.load(dictString) as any
    } catch (error) {
        console.error(error)
        return
    }
}

export const loadDirectory = async (directory: string) => {
    const fullPath = getAssetPath(directory)
    DEBUG && console.log(`[loading] directory ${fullPath}`)

    try {
        const files = await (await FileSystem.readDirectoryAsync(fullPath)).sort()

        const output = []
        for (const file of files) {
            output.push(await loadDirectoryOrFile(`${directory}/${file}`))
        }
        return output
    } catch (error) {
        console.error(error)
        return []
    }
}

const loadDirectoryOrFile = async (path: string) => {
    if (await isDirectory(getAssetPath(path))) {
        const content: any[] = await loadDirectory(path)
        const metadata = await loadFile(`${path}/index.yml`)
        return { path, content, metadata }
    } else {
        const content: any = await loadFile(path)
        return { path, content }
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
export const loadLiturgy = async (occasion: Types.Occasion): Promise<PrayerGroup[]> => {
    const subDirs = await loadDirectory('coptish-datastore/output/liturgy-st-basil')
    return subDirs.map(({ content, ...rest }) => ({
        ...rest,
        prayers: content
            ?.filter(({ path }: { path: string }) => filename(path)?.match(/\d{2}-/))
            ?.map(({ path, content }: { path: string; content: Types.Prayer }) => ({ ...content, id: filename(path)?.replace('.yml', '') }))
            ?.filter(isOccasion(occasion))
            ?.map((prayer: Types.Prayer) => ({ ...prayer, sections: prayer?.sections?.filter(isOccasion(occasion)) })),
    }))
}

export const loadCompoundPrayer = async (path: string): Promise<Types.Prayer[]> => {
    const prayers = await loadDirectory(`coptish-datastore/output/${path}`)
    return prayers?.map(({ content }: { path: string; content: any; metadata?: undefined }) => content)
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

const makeDirectoryRecursive = async (path: string) => {
    const pathParts = path.split('/')

    let currentDirectory = '.'
    pathParts.forEach(async (pathPart, i) => {
        if (i === 0) return

        currentDirectory += `/${pathPart}`
        const fullPath = getAssetPath(currentDirectory)
        if ((await isExist(fullPath)) && !(await isDirectory(fullPath))) {
            DEBUG && console.log(`[delete] Deleting ${fullPath}`)
            await FileSystem.deleteAsync(fullPath)
        }
        if (!(await isExist(fullPath))) {
            DEBUG && console.log(`[mkdir] Creating ${fullPath}`)
            await FileSystem.makeDirectoryAsync(fullPath, { intermediates: true })
        }

        DEBUG && console.log(`[checking directory] ${fullPath} isExist:${await isExist(fullPath)}`)
    })
}

export const initCoptishDatastore = async (callback?: (currentAsset: string) => void) => {
    let i = 0
    for (const { path, module } of assets) {
        if (path.includes('readings/')) continue // TODO: remove
        const targetPath = getAssetPath(path)

        DEBUG && console.log(`[copying ${i + 1}/${assets.length}] ${path}`)
        callback?.(`[copying ${i + 1}/${assets.length}] ${path}`)
        i += 1

        const [{ localUri: sourcePath }] = await Asset.loadAsync(module)
        if (!sourcePath) continue

        try {
            const sourceInfo = await FileSystem.getInfoAsync(sourcePath, { md5: true })
            const targetInfo = await FileSystem.getInfoAsync(targetPath, { md5: true })

            if (targetInfo.exists && sourceInfo.exists && targetInfo.md5 === sourceInfo.md5) continue
        } catch (error) {
            console.error(error)
        }

        const dirPath = dirname(targetPath)
        try {
            DEBUG && console.log(`[checking directory] ${dirPath} isExist:${await isExist(dirPath)}`)
            await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true })
        } catch (error) {
            console.error(error)
        }

        try {
            await FileSystem.copyAsync({ from: sourcePath, to: targetPath })
            const content = await FileSystem.readAsStringAsync(sourcePath, { encoding: 'utf8' })
            await FileSystem.writeAsStringAsync(targetPath, content, { encoding: 'utf8' })
        } catch (error) {
            console.error(error)
        }
        DEBUG && console.log(`[checking file] ${targetPath} isExist:${await isExist(targetPath)}`)
        DEBUG && console.log(`[checking directory] ${dirPath} isExist:${await isExist(dirPath)}`)
    }
}

export const clearAssets = async () => {
    const files = await await FileSystem.readDirectoryAsync(getAssetPath(''))
    await Promise.all(files.map((file) => FileSystem.deleteAsync(getAssetPath(file))))

    DEBUG && console.log(`[clear] ${ASSET_DIRECTORY}`)
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
