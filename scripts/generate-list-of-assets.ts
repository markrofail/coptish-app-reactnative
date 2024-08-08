import fs from 'fs'
import path from 'path'

const ROOT = path.join(__dirname, '..')
const ASSETS_DIRECTORY = path.join(ROOT, 'assets')
const OUTPUT_FILE = path.join(ROOT, 'src/data/assets.ts')

const listAllAssets = (directory: string): string[] =>
    fs
        .readdirSync(directory)
        .flatMap((file) => {
            const filepath = path.join(directory, file)
            if (fs.statSync(filepath).isDirectory()) return listAllAssets(filepath)
            if (file.includes('.yml')) return [filepath]
            return []
        })
        .filter(Boolean) // filter undefined

const assets = listAllAssets(ASSETS_DIRECTORY).map(
    (file) => `
    { 
        path: '${path.relative(ASSETS_DIRECTORY, file)}',
        module: require('${path.relative(path.dirname(OUTPUT_FILE), file)}')
    },`
)

fs.writeFileSync(OUTPUT_FILE, `export default [${assets.join('')}\n] as const\n`)
console.log('Asset list generated:', OUTPUT_FILE)
