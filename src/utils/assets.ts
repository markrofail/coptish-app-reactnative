import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'
import { Asset } from 'expo-asset'
import yaml from 'js-yaml'
import { DEBUG } from '../config'
import assets from '../data/assets'
import { Types } from '../types'
import { getIsoCopticDate, getIsoGeorgianDate } from './date'

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

const isOccasion = (occasion: Types.Occasion) => (prayerOrSection: Types.Prayer | Types.Section) =>
    !prayerOrSection?.occasion || prayerOrSection?.occasion === occasion

const filename = (path?: string) => path?.split('/').pop()

export const loadLiturgy = async (occasion: Types.Occasion): Promise<Types.Liturgy> => {
    const subDirs = await loadDirectory('coptish-datastore/liturgy-st-basil')
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
    const prayers = await loadDirectory(`coptish-datastore/${path}`)
    return prayers?.map(({ content }: { path: string; content: any; metadata?: undefined }) => content)
}

export const loadReading = async (date: Date, type: Types.ReadingType): Promise<Types.Reading | Types.Synaxarium> => {
    const filename = type === 'synaxarium' ? getIsoCopticDate(date) : getIsoGeorgianDate(date)
    return await loadFile(`coptish-datastore/readings/${type}/${filename}.yml`)
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

export const initCoptishDatastore = async () => {
    let i = 0
    for (const { path, module } of assets) {
        const targetPath = getAssetPath(path)

        DEBUG && console.log(`[copying ${i + 1}/${assets.length}] ${JSON.stringify({ path, targetPath, isExist: await isExist(targetPath) }, null, 2)}`)

        const asset = Asset.fromModule(module)
        await asset.downloadAsync()
        const sourcePath = asset.localUri
        if (!sourcePath) return

        try {
            if (await isExist(targetPath)) {
                const sourceContent = await FileSystem.readAsStringAsync(sourcePath, { encoding: 'utf8' })
                const sourceChecksum = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, sourceContent)

                const targetContent = await FileSystem.readAsStringAsync(targetPath, { encoding: 'utf8' })
                const targetChecksum = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, targetContent)

                if (sourceChecksum === targetChecksum) return
                else await FileSystem.deleteAsync(targetPath)
            }
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
        } catch (error) {
            console.error(error)
        }
        DEBUG && console.log(`[checking file] ${targetPath} isExist:${await isExist(targetPath)}`)
        DEBUG && console.log(`[checking directory] ${dirPath} isExist:${await isExist(dirPath)}`)

        i += 1
    }
}

const dirname = (path: string) => {
    const parts = path.split('/')
    parts.pop()
    return parts.join('/')
}

export const clearAssets = async () => {
    const files = await await FileSystem.readDirectoryAsync(getAssetPath(''))
    await Promise.all(files.map((file) => FileSystem.deleteAsync(getAssetPath(file))))

    DEBUG && console.log(`[clear] ${ASSET_DIRECTORY}`)
}

export const initAssets = async () => {
    await initCoptishDatastore()
}

export const treeAssets = async (path = 'coptish-datastore', indent = 0) => {
    console.log('\t'.repeat(indent) + '- ' + filename(path))
    const files = (await FileSystem.readDirectoryAsync(getAssetPath(path))).sort()
    for (const file of files) {
        if (await isDirectory(getAssetPath(`${path}/${file}`))) await treeAssets(`${path}/${file}`, indent + 2)
        else console.log('\t'.repeat(indent + 2) + '- ' + `${path}/${file}`.split('/').slice(-2).join('/'))
    }
}
