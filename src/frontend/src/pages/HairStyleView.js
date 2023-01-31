import React, {Component} from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import ARCanvas from '../components/ARCanvas'

class HairStyleView extends Component {

  render() {
    return (
      <>
        <ARCanvas/>
      </>
    )
  }
}
export default HairStyleView;
