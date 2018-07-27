import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Modal, Transition, Button, Message, Label } from 'semantic-ui-react';

import { getPublicKey } from '../../actions/ledger';

type Props = {
  getPublicKey: () => {},
  publicKey: {},
  loading: {},
  states: {},
  short: undefined
};

class PublicKeyComponent extends Component<Props> {
  state = { opened: false };

  verifyPublicKey = () => {
    this.props.getPublicKey(true);
    this.setState({ opened: true });
  };

  handleClose = () => this.setState({ opened: false });

  render() {
    const { publicKey, loading, states, short } = this.props;
    const { opened } = this.state;
    const formattedKey = short
      ? `${publicKey.wif.slice(0, 5)}...${publicKey.wif.slice(-5)}`
      : publicKey.wif;

    let action = '';
    let message = '';
    if (opened && loading.PUBLIC_KEY_DISPLAY === false) {
      if (states.displayPublicKey) {
        action = (
          <CopyToClipboard text={publicKey.wif}>
            <Button content="Copy to clipborad" onClick={this.handleClose} />
          </CopyToClipboard>
        );
      } else {
        action = <Button content="Close" onClick={this.handleClose} />;
        message = <Message error content="Canceled." />;
      }
    }

    return (
      <Button as="div" labelPosition="right" className="publickeycontainer">
        <Button icon="copy" basic onClick={this.verifyPublicKey} />
        <Label as="div" basic>
          {formattedKey}
        </Label>
        <Transition animation="scale" duration={200}>
          <Modal open={opened} size="tiny">
            <Modal.Header>Verify public key with your device</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p id="publickey">{publicKey.wif}</p>
                {message}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>{action}</Modal.Actions>
          </Modal>
        </Transition>
      </Button>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  states: state.states,
  publicKey: state.accounts.publicKey
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPublicKey
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PublicKeyComponent);
