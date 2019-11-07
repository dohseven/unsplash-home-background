const { BaseKonnector, log, saveFiles, mkdirp } = require('cozy-konnector-libs')

// Documentation:
// - Unsplash: https://source.unsplash.com/
// - saveFiles: https://github.com/konnectors/libs/blob/master/packages/cozy-konnector-libs/docs/api.md#module_saveFiles

const baseUrl = 'https://source.unsplash.com'

module.exports = new BaseKonnector(start)

async function start(fields, cozyParameters) {
  if (cozyParameters) log('debug', 'Found COZY_PARAMETERS')

  // Hard-coded path of the user wallpaper: /Photos/Settings/Wallpaper.jpg
  const folderPath = '/Photos/Settings/'
  const filename = 'Wallpaper.jpg'

  // Create directory if not present.
  await mkdirp(folderPath)

  log('info', 'Retrieve featured picture with keyword "' + fields.keyword + '"')
  // Download and save image.
  await saveFiles(
    [
      {
        // Download a photo from the featured collections, with the provided keyword.
        fileurl: `${baseUrl}/featured/?` + fields.keyword,
        filename: filename,
        fileAttributes: { created_at: new Date() },
        // Always replace file.
        shouldReplaceFile: () => true
      }
    ],
    { folderPath: folderPath },
    {
      contentType: 'image/jpeg',
      sourceAccount: 'unsplash-home-background',
      sourceAccountIdentifier: fields.keyword
    }
  )
}
