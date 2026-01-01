const { desktopCapturer } = require('electron');

async function getSources() {
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen', 'window'],
            thumbnailSize: { width: 320, height: 180 },
            fetchWindowIcons: true
        });

        return sources.map(source => ({
            id: source.id,
            name: source.name,
            thumbnail: source.thumbnail.toDataURL(),
            appIcon: source.appIcon?.toDataURL() || null,
            isScreen: source.id.startsWith('screen:')
        }));
    } catch (error) {
        console.error('Error getting sources:', error);
        return [];
    }
}

async function getScreenStream(sourceId) {
    // This returns the source ID for the renderer to use with getUserMedia
    return sourceId;
}

module.exports = { getSources, getScreenStream };
