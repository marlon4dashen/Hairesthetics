import React, {Component} from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import ARCanvas from '../components/ARCanvas'
import Scrollbar from '../components/Scrollbar'

class HairStyleView extends Component {

  render() {
    return (
      <>
        {/* <ARCanvas/> */}
        <Scrollbar/>
      </>
    )
  }
}
export default HairStyleView;
