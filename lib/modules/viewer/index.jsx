
import React from 'react'
import ReactDOM from 'react-dom'
import autoBind from 'react-autobind'
import linkState from 'react-link-state'
import rp from 'request-promise'
import $ from 'jquery'
import _ from 'lodash'

import {DropdownSelectionFixed} from '../util/DropdownSelection'

import {globalEventEmitter} from './event'
import {AndroidDeviceConnector} from './backend/android-connector'
import {Unity3dDeviceConnector} from './backend/unity3d-connector'
import {MODE_ANDROID_APP, MODE_UNITY} from './connector-modes'


class MainConnector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            connectorMode: localStorage.getItem('connector-mode') || MODE_ANDROID_APP,
            inspectorViewInstance: null,
        }
        autoBind(this)
    }

    handleModeChanged(val, key) {
        localStorage.setItem('connector-mode', val)
    }

    componentDidMount() {
        globalEventEmitter.on('disconnect-device', this.disconnectDevice)
    }
    componentWillUnmount() {
        globalEventEmitter.removeListener('disconnect-device', this.disconnectDevice)
    }

    connectDevice(inspectorViewInstance) {
        this.setState({inspectorViewInstance: inspectorViewInstance})
    }
    disconnectDevice() {
        this.setState({inspectorViewInstance: null})
    }

    render() {
        return <div>
            {!this.state.inspectorViewInstance && <div>
                <div style={{backgroundColor: '#222', padding: '5px 15px'}}>
                    <h3>Poco Hierarchy Viewer</h3>
                    <div>
                        <span>mode: </span>
                        <DropdownSelectionFixed selections={[MODE_ANDROID_APP, MODE_UNITY]} valueLink={linkState(this, 'connectorMode')} onSelect={this.handleModeChanged} />
                    </div>
                </div>

                <div style={{marginLeft: '15px'}}>
                    {this.state.connectorMode === MODE_ANDROID_APP && <AndroidDeviceConnector onConnectDevice={this.connectDevice} />}
                    {this.state.connectorMode === MODE_UNITY && <Unity3dDeviceConnector onConnectDevice={this.connectDevice}/>}
                </div>
            </div>}

            {this.state.inspectorViewInstance}
        </div>
    }
}


$(document).ready(function () {
    ReactDOM.render(
        <MainConnector />,
        $('#main').get(0)
    )
})

