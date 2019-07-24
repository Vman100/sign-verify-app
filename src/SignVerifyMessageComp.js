import React from 'react';
import { ethers } from 'ethers';
import './SignVerifyMessageComp.css'

class SignVerifyMessageComp extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
			loading: true,
			rawMessage: '',
			signer: '',
			contract: '',
			hasErrored: false,
			errorMessage: '',
			isVerified: false,
			resultMessage: ''
    }
    this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
  }


	async componentDidMount() {
		if (window.ethereum) {
			try {
				if (typeof window.ethereum.selectedAddress === 'undefined') {
					await window.ethereum.enable()
				}
				const provider = await new ethers.providers.Web3Provider(window.ethereum)
				this.setState({signer: provider.getSigner()})
				let abi = [
    			'function verifyString(string, uint8, bytes32, bytes32) public pure returns (address)'
				]
				//contract address on kovan network
				let contractAddress = '0x20c3e202c4f2fc6e250db20a8a7883f7255e5115'
				this.setState({contract: await new ethers.Contract(contractAddress, abi, provider)})
			} catch (error) {
				this.setState({hasErrored: true, errorMessage: 'You denied access to your metamask.'})
			}
		}
		this.setState({loading: false})
	}

	handleSubmit = async event => {
		event.preventDefault()
		const {rawMessage, signer, contract} = this.state
		let signerAddress = await signer.getAddress()
		console.log('signer address', signerAddress)
		try {
			let signedMessage = await signer.signMessage(rawMessage)
			console.log('signed message', signedMessage)
			this.setState({errorMessage: ''})	
			let sig = ethers.utils.splitSignature(signedMessage)
			console.log('expanded signature', sig)
			let recovered = await contract.verifyString(rawMessage, sig.v, sig.r, sig.s);
			if(signerAddress === recovered) {
				this.setState({isVerified: true, resultMessage: 'Message Signature Verified'})
			} else {
				this.setState({isVerified: false, resultMessage: 'Message Signature Verification Failed'})
			}
		} catch (error) {
			this.setState({errorMessage: 'You denied signing the message.'})	
		}
	}

	handleChange = event => {
    const { target } = event
    const { value } = target
    const { name } = target
    this.setState({ [name]: value })
  }

	render() {
		const { rawMessage, loading, hasErrored, errorMessage, isVerified, resultMessage } = this.state
		let resultStyle
		if(loading) {
			return (
				<div>...loading</div>
			)
		}
		if(hasErrored) {
			return (
				<div>{errorMessage}</div>
			)
		}
		if(isVerified) {
			resultStyle = {color: 'lime'}
		} else {
			resultStyle = {color: "red"}
		}
		return (
			<div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="rawMessage">
            Message:
            <input
              type="text"
              name="rawMessage"
              onChange={this.handleChange}
              value={rawMessage}
            />
          </label>
          <button className='button' type="submit">sign and verify message</button>
        </form>
				<span>{errorMessage}</span>
				<span style={resultStyle}>{resultMessage}</span>
      </div>
		)
	}
}

export default SignVerifyMessageComp;

