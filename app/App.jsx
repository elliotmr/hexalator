import React, { Component, PropTypes } from 'react';
import BinaryField from './BinaryField.jsx';
import HexField from './HexField.jsx';
import SignedField from './SignedField.jsx';
import StringField from './StringField.jsx';
import UnsignedField from './UnsignedField.jsx';

class App extends Component {
    constructor(props) {
        super(props);
        this.fieldUpdate = this.fieldUpdate.bind(this);
    }
    
    static propTypes = {
        state: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired
    }

    fieldUpdate(field, value) {
        const { state, update } = this.props;
        update(state.type, field, state.endian, state.num_bytes, value);
    }

    render() {
        const { state } = this.props;
        return (
            <div>
                <h1>Hello World!</h1>
                <BinaryField update={this.fieldUpdate} value={state.data.binary}/>
                <HexField update={this.fieldUpdate} value={state.data.hex}/>
                <SignedField update={this.fieldUpdate} value={state.data.signed_decimal}/>
                <StringField update={this.fieldUpdate} value={state.data.string}/>
                <UnsignedField update={this.fieldUpdate} value={state.data.unsigned_decimal}/>
            </div>
        );
    }
}

export default App;