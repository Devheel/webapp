import React from 'react'
import PropTypes from 'prop-types'
import StreamContainer from '../../containers/StreamContainer'
import { CategorySubNav } from '../categories/CategoryRenderables'
import { MainView } from '../views/MainView'

export const Discover = ({ streamAction, kind, stream }) => (
  <MainView className="Discover">
    <CategorySubNav stream={stream} kind={kind} />
    <StreamContainer
      action={streamAction}
      paginatorText="Load More"
    />
  </MainView>
)

Discover.propTypes = {
  streamAction: PropTypes.object.isRequired,
  stream: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
}

export default Discover
