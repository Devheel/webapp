import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/discover'
import {
  postsAsGrid,
  postsAsList,
} from '../../../src/components/streams/StreamRenderables'

describe('discover actions', () => {
  context('#loadGlobalPostStream', () => {
    const action = subject.loadGlobalPostStream('trending')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(action.type).to.equal('V3.LOAD_STREAM')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
    })
  })

  context('#bindDiscoverKey', () => {
    const action = subject.bindDiscoverKey('trending')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.bindDiscoverKey)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.type).to.equal('trending')
    })
  })
})

