import React, {Component, PropTypes} from 'react';
import BinaryField from './BinaryField.jsx';
import HexField from './HexField.jsx';
import SignedField from './SignedField.jsx';
import StringField from './StringField.jsx';
import UnsignedField from './UnsignedField.jsx';
import BytesSelect from './BytesSelect.jsx';
import EndianSelect from './EndianSelect.jsx';

class App extends Component {
    constructor(props) {
        super(props);
        this.fieldUpdate = this
            .fieldUpdate
            .bind(this);
        this.bytesUpdate = this
            .bytesUpdate
            .bind(this);
        this.endianUpdate = this
            .endianUpdate
            .bind(this);
    }

    static propTypes = {
        state: PropTypes.object.isRequired,
        update: PropTypes.func.isRequired
    }

    fieldUpdate(field, value) {
        const {state, update} = this.props;
        update(state.type, field, state.endian, state.num_bytes, value);
    }

    bytesUpdate(num_bytes) {
        const {state, update} = this.props;
        update(state.type, "signed_decimal", state.endian, num_bytes, state.data.signed_decimal);
    }

    endianUpdate(endian) {
        const {state, update} = this.props;
        update(state.type, "signed_decimal", endian, state.num_bytes, state.data.signed_decimal);
    }

    render() {
        const {state} = this.props;
        return (
            <div>
                <BinaryField update={this.fieldUpdate} value={state.data.binary}/>
                <HexField update={this.fieldUpdate} value={state.data.hex}/>
                <SignedField update={this.fieldUpdate} value={state.data.signed_decimal}/>
                <StringField update={this.fieldUpdate} value={state.data.string}/>
                <UnsignedField update={this.fieldUpdate} value={state.data.unsigned_decimal}/>
                <BytesSelect update={this.bytesUpdate} value={state.num_bytes}/>
                <EndianSelect update={this.endianUpdate} value={state.endian}/>
            </div>
        );
    }
}

export default App;