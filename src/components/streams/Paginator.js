import React, { Component, PropTypes } from 'react'
import { ElloMark } from '../interface/ElloIcons'

class Paginator extends Component {

  componentWillMount() {
    this.state = { isPaginationLoading: false, message: this.getMessage() }
    this.loadMore = ::this.loadMore
  }

  getMessage() {
    const { hasShowMoreButton, pagination } = this.props
    const totalPages = parseInt(pagination.totalPages, 10)
    const totalPagesRemaining = parseInt(pagination.totalPagesRemaining, 10)
    if (parseInt(pagination.totalPagesRemaining, 10) === 0) {
      return ''
    } else if (hasShowMoreButton) {
      return `+more..`
    }
    return (totalPages > 0) ?
      `Loading: ${totalPages - totalPagesRemaining + 1} of ${totalPages}` :
      'Loading...'
  }

  setLoading(isPaginationLoading) {
    this.state = { isPaginationLoading, message: this.getMessage() }
  }

  loadMore() {
    const { delegate } = this.props
    if (delegate && typeof delegate.onLoadNextPage === 'function') {
      delegate.onLoadNextPage()
    }
  }

  render() {
    const { isPaginationLoading, message } = this.state
    const { hasShowMoreButton } = this.props
    const classes = isPaginationLoading ? 'Paginator isBusy' : 'Paginator'
    const messageArea = hasShowMoreButton ?
      <button onClick={ this.loadMore }>{ message }</button> :
      <span>{ message }</span>
    return (
      <div className={ classes }>
        <ElloMark />
        { messageArea }
      </div>
    )
  }
}

Paginator.propTypes = {
  delegate: PropTypes.object,
  hasShowMoreButton: PropTypes.bool,
  pagination: PropTypes.object,
}

export default Paginator

