import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const ROOT = path.join(__dirname, '..')
const ASSETS_DIRECTORY = path.join(ROOT, 'assets')
const OUTPUT_FILE = path.join(ROOT, 'src/data/table-of-contents.ts')

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

const getTitle = (filepath: string): Record<string, string> => {
    const fileContent = yaml.load(fs.readFileSync(filepath, 'utf-8'))
    return (fileContent as any)?.title as Record<string, string>
}

const assets = listAllAssets(ASSETS_DIRECTORY).map(
    (file) => `
    { 
        path: './${path.relative(ROOT, file)}',
        title: ${JSON.stringify(getTitle(file))}
    },`
)

fs.writeFileSync(OUTPUT_FILE, `export default [${assets.join('')}\n] as const\n`)
console.log('Asset list generated:', OUTPUT_FILE)
