import React from 'react'
import { SVGIcon } from './SVGComponents'

// -------------------------------------

export class PlusIcon {
  getClassList() {
    return 'PlusIcon'
  }

  render() {
    return (
      <SVGIcon className={this.getClassList()}>
        <g>
          <line x1="4.5" y1="9.5" x2="14.5" y2="9.5"/>
          <line x1="9.5" y1="14.5" x2="9.5" y2="4.5"/>
        </g>
      </SVGIcon>
    )
  }
}

export class MinusIcon extends PlusIcon {
  getClassList() { return 'MinusIcon' }
}

// -------------------------------------

export class ChevronIcon {
  getClassList() {
    return 'ChevronIcon'
  }

  render() {
    return (
      <SVGIcon className={this.getClassList()}>
        <g>
          <polyline points="6,16 12,10 6,4"/>
        </g>
      </SVGIcon>
    )
  }
}
