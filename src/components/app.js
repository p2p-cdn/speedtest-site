'use strict'

const React = require('react')
const Hash = require('ipfs-only-hash')

// sleep nonblocking
const sleep = ms => new Promise(r => setTimeout(r, ms));


class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      p2pTime: 'TBD',
      cdnTime: 'TBD',
      ready: false,
      sessionId: 0,
    }

    // react is annyoing
    this.timeP2P = this.timeP2P.bind(this);
    this.timeCDN = this.timeCDN.bind(this);
    this.findPeers = this.findPeers.bind(this);
  }

  componentDidMount () {
    this.setup()
  }

  async setup () {
    await this.findPeers()
    await sleep(2000)

    this.setState({ ready: true })

    // periodically sync back up with the peer network
    while (true) {
      await sleep(12000)
      this.setState({ ready: false })
      await this.findPeers()
      await sleep(1500)
      this.setState({ ready: true })
    }
  }

  async timeP2P() {
    var frame = document.getElementById("ipfsFrame")
    const start = performance.now()
    frame.src = "apple-ipfs.html"
    frame.onload = () => {
        const end = performance.now()
        this.setState({ p2pTime: end - start })
    }
  }

  async timeCDN() {
    if (!this.state.ready) return;

    var frame = document.getElementById("cdnFrame")
    const start = performance.now()
    frame.src = "apple-cdn.html"
    frame.onload = () => {
        const end = performance.now()
        this.setState({ cdnTime: end - start })
    }
  }

  // generate a coordinated dynamic file hash to use the DHT to find other
  //  peers using this system (part of the p2p CDN)
  async findPeers() {
    const sessionId = Math.floor(Date.now() / (1000 * 60)) // changes every minute
    this.setState({ sessionId })
    const token = 'Member of P2P CDN Session: ' + sessionId
    const hash = await Hash.of(Buffer.from(token))
    console.log('requesting magic hash: ' + hash)
    await fetch('http://ipfs.io/ipfs/' + hash)
    console.log(token)
  }

  render () {
    return (
      <div style={{ textAlign: 'center', fontFamily: 'Roboto' }}>
        <h1>CDN vs P2P speedtest</h1>
        { this.state.ready
          ? <p>Current session: {this.state.sessionId}</p>
          : <div>
              <div class="lds-dual-ring"></div>
              <p>Discovering more peers...</p>
            </div>
        }
        <hr />
        <br />
        <br />

        <iframe id="ipfsFrame" style={{width: '90%', height: '80%'}}></iframe>
        <div style={{
          border: '2px solid gray',
          borderRadius: '8px',
          margin: '1em auto 0 auto',
          padding: '1em 1em 0 1em',
          width: '120px'
        }}>
          <button onClick={this.timeP2P} disabled={!this.state.ready}>
            time p2p
          </button>
          <h2>{this.state.p2pTime + ' '}<i>ms</i></h2>
        </div>

        <br />

        <iframe id="cdnFrame" style={{width: '90%', height: '80%'}}></iframe>
        <div style={{
          border: '2px solid gray',
          borderRadius: '8px',
          margin: '1em auto 0 auto',
          padding: '1em 1em 0 1em',
          width: '120px'
        }}>
          <button onClick={this.timeCDN} disabled={!this.state.ready}>
            time CDN
          </button>
          <h2>{this.state.cdnTime + ' '}<i>ms</i></h2>
        </div>

        <br />

        <p>For the p2p half to work properly, you'll need the&nbsp;
          <a href="https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch" target="_blank">
            IPFS companion add-on
          </a>
          &nbsp;and an IPFS node running locally on your computer.
        </p>
      </div>
    )
  }
}
module.exports = App
