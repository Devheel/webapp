import Immutable from 'immutable'
import { getSource } from '../../../../src/components/assets/BackgroundImage'

function tmpCover() {
  return Immutable.fromJS({
    tmp: { url: 'cover-tmp.jpg', metadata: 'temporary' },
    optimized: { url: 'cover-optimized.jpg', metadata: 'optimized' },
    original: { url: 'cover-original.jpg', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.jpg', metadata: 'xhdpi' },
  })
}

function jpgCover() {
  return Immutable.fromJS({
    optimized: { url: 'cover-optimized.jpg', metadata: 'optimized' },
    original: { url: 'cover-original.jpg', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.jpg', metadata: 'xhdpi' },
  })
}

function gifCover() {
  return Immutable.fromJS({
    optimized: { url: 'cover-optimized.gif', metadata: 'optimized' },
    original: { url: 'cover-original.gif', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.gif', metadata: 'xhdpi' },
  })
}

function videoCover() {
  return Immutable.fromJS({
    original: { url: 'cover-original.gif', metadata: 'original' },
    video: { url: 'cover-video.mp4', metadata: 'video' },
  })
}

function buggedCover() {
  return Immutable.fromJS({
    optimized: { url: 'cover-optimized.jpg', metadata: 'optimized' },
    original: { url: 'cover-original.jpg', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.gif', metadata: 'xhdpi' },
    video: { url: 'cover-video.mp4', metadata: 'video' },
  })
}

describe('BackgroundImage', () => {
  context('#getSource', () => {
    const props1 = { dpi: 'xhdpi', sources: null, useGif: false }
    const props2 = { dpi: 'xhdpi', sources: tmpCover(), useGif: false }
    const props3 = { dpi: 'xhdpi', sources: gifCover(), useGif: true }
    const props4 = { dpi: 'xhdpi', sources: jpgCover(), useGif: true }
    const props5 = { dpi: 'optimized', sources: jpgCover(), useGif: false }
    const props6 = { dpi: 'optimized', sources: videoCover(), useGif: true }
    const props7 = { dpi: 'optimized', sources: buggedCover(), useGif: true }

    it('returns an empty string if the sources is null', () => {
      expect(getSource(props1)).to.equal('')
    })

    it('returns the source to the tmp url when it is available', () => {
      expect(getSource(props2)).to.equal('cover-tmp.jpg')
    })

    it('returns the source to the original when useGif is true and the file is a gif', () => {
      expect(getSource(props3)).to.equal('cover-original.gif')
    })

    it('returns the regular size when useGif is true but it is not a gif', () => {
      expect(getSource(props4)).to.equal('cover-xhdpi.jpg')
    })

    it('returns the large size when the size changes', () => {
      expect(getSource(props5)).to.equal('cover-optimized.jpg')
    })

    it('returns the video if available', () => {
      expect(getSource(props6)).to.equal('cover-video.mp4')
    })

    it('does not return the video if original is not a gif/video', () => {
      expect(getSource(props7)).to.equal('cover-optimized.jpg')
    })
  })
})

